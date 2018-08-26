from django.db.models import Count
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.schemas import AutoSchema
from rest_framework import status
from rest_framework.response import Response
import coreapi
import coreschema

from feed.models import (UserCategory, UserFeed, Status, Post, DefaultFeed, DefaultCategory,
                         Similarity, UserActivity, Favorite, Activity)
from api.serializers import (UserCategorySerializer, UserActivitySerializer,
                             FeedStatusSerializer, PostSerializer, UserFeedSerializer,
                             DefaultCategorySerializer, UserFavoriteSerializer)
from api.pagination import PostsPagination
from api.permission import CategoryPermission


class UserCategoryViewSet(ModelViewSet):
    """
    list:
    Get a list of all of a user's categories

    read:
    Get details on a specific category

    create:
    Add a new category

    update:
    Fully update a user's category

    partial_update:
    Partially update a user's category

    delete:
    Remove a user's category
    """
    permission_classes = (CategoryPermission,)

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return UserCategorySerializer
        return DefaultCategorySerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return UserCategory.objects.filter(curator=self.request.user) \
                               .order_by('ordinal')
        else:
            return DefaultCategory.objects.all().order_by('ordinal')


class UserFeedViewSet(ModelViewSet):
    """
    list:
    Get a list of all of a user's feeds

    read:
    Get details on a specific feed

    create:
    Add a new feed

    update:
    Fully update a user's feed

    partial_update:
    Partially update a user's feed

    delete:
    Remove a user's feed
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = UserFeedSerializer

    def get_queryset(self):
        return UserFeed.objects.filter(category__curator=self.request.user)


class FeedsView(ListAPIView):
    """
    Get a list of all available feeds
    """
    serializer_class = UserFeedSerializer
    queryset = UserFeed.objects.all()


class FeedStatusView(ListAPIView):
    """
    Get a list of a user's feed statuses.
    """
    serializer_class = FeedStatusSerializer
    queryset = Status.objects.all().order_by('-update_datetime')


class BasePostsView(ListAPIView):
    """
    Base class for posts, from which more specific views are derived
    """
    serializer_class = PostSerializer
    pagination_class = PostsPagination

    def _sort_posts(self, posts, valid_sorts, default_sort):
        """
        Sort posts as required.

        :param posts: Unsorted queryset
        :returns: Sorted queryset
        """
        params = self.request.query_params

        # set a default in case nothing is provided
        sort = default_sort

        # If a param is provided and it is legit, use it.
        if 'sort' in params and params['sort'] in valid_sorts:
            sort = params['sort']

        if sort == 'hot':
            # Order queryset the number of actvity entries for a post
            # This lets popular posts bubble up. This will bias the results,
            # so we may need to reconsider in the future.
            posts = posts.annotate(count=Count('activity')) \
                         .order_by('-count', '-published_datetime')
        else:
            # Sort by the chosen parameter
            posts = posts.order_by(valid_sorts[params['sort']])

        return self.deduplicate_posts(posts)

    def deduplicate_posts(self, posts):
        """
        Deduplicated posts from a queryset.

        A post can belong to multiple feeds. A view can have multiple feeds. It's
        possible that the same post will show up multiple times in a given view.
        """
        unique_posts = []
        link_hashes = []
        for post in posts:
            if post.link_hash not in link_hashes:
                unique_posts.append(post)
                link_hashes.append(post.link_hash)

        return unique_posts


class PostsView(BasePostsView):
    """
    Get a complete set of posts. Posts can be filtered by category, and sorted
    by time or popularity.
    """
    schema = AutoSchema(
        manual_fields=[
            coreapi.Field("category", description="Category", location="query",
                          schema=coreschema.String()),
            coreapi.Field("sort", description="Sort", location="query",
                          schema=coreschema.String())
        ]
    )

    def filter_categories(self, posts):
        """
        Filter categories as required.

        :param posts: Unfiltered post queryset
        :returns: Filtered queryset
        """
        params = self.request.query_params

        # If a user is authenticated, get their feeds. Otherwise select the
        # defaults.
        if self.request.user.is_authenticated:
            feeds = self.get_authenticated_feeds()
        else:
            feeds = self.get_anonymous_feeds()

        # If a category param is specified, filter feeds to it.
        if 'category' in params:
            feeds = feeds.filter(category__id=params['category'])

        # Get a list of category IDs matching pertinent feeds
        cat_ids = set([p.id for feed in feeds for p in feed.url.posts.all()])

        # Filter posts to those in the feeds
        return posts.filter(id__in=cat_ids)

    def get_recent_posts(self):
        """
        Select all recently pubilshed posts.

        :returns: Queryset of all posts published in the past two days.
        """
        publish_offset = now() - timedelta(days=3)

        return Post.objects.prefetch_related('feed_url') \
                   .filter(published_datetime__gte=publish_offset)

    def get_anonymous_feeds(self):
        """
        Get feeds for anonymous users.

        :returns: Queryset of default feeds
        """
        return DefaultFeed.objects.all()

    def get_authenticated_feeds(self):
        """
        Get feeds for a specific users.

        :returns: Queryset of user's feeds
        """
        return UserFeed.objects.filter(curator=self.request.user)

    def get_queryset(self):
        """
        Get the view's queryset, filtered and sorted as required.

        :returns: Post queryset
        """
        recent_posts = self.get_recent_posts()
        category_posts = self.filter_categories(recent_posts)
        sorted_posts = self.sort_posts(category_posts)
        deduped_posts = self.deduplicate_posts(sorted_posts)
        return deduped_posts

    def sort_posts(self, posts):
        """
        Sort posts as required.

        :param posts: Unsorted queryset
        :returns: Sorted queryset
        """
        valid_sorts = {
            'new': '-published_datetime',
            'hot': 'hot'
        }

        return self._sort_posts(posts, valid_sorts, 'hot')


class SimilarPostsView(BasePostsView):
    """
    Get a set of posts deemed similar to a specific post ID.
    """
    schema = AutoSchema(
        manual_fields=[
            coreapi.Field("post", description="Post", location="query",
                          schema=coreschema.String()),
            coreapi.Field("sort", description="Sort", location="query",
                          schema=coreschema.String())
        ]
    )

    def get_queryset(self):
        params = self.request.query_params

        post_ids = [params['post']]
        sims = Similarity.objects.filter(source_id=params['post'], score__gte=0.9125) \
                         .order_by('-score') \
                         .values_list('related')

        post_ids.extend([p[0] for p in sims])

        posts = Post.objects.filter(id__in=post_ids)

        sorted_posts = self.sort_posts(posts)

        deduped_posts = self.deduplicate_posts(sorted_posts)

        return deduped_posts

    def sort_posts(self, posts):
        """
        Sort posts as required.

        :param posts: Unsorted queryset
        :returns: Sorted queryset
        """
        valid_sorts = {
            'new': '-published_datetime',
            'hot': 'hot'
        }

        return self._sort_posts(posts, valid_sorts, 'hot')


class BookmarkedPostsView(BasePostsView):
    """
    Get a set of posts bookmarked by the current user.
    """
    permission_classes = (IsAuthenticated,)

    schema = AutoSchema(
        manual_fields=[
            coreapi.Field("sort", description="Sort", location="query",
                          schema=coreschema.String())
        ]
    )

    def get_queryset(self):
        bookmarks = Favorite.objects.filter(user=self.request.user) \
                            .values_list('post')

        posts = Post.objects.filter(id__in=bookmarks)

        sorted_posts = self.sort_posts(posts)

        deduped_posts = self.deduplicate_posts(sorted_posts)

        return deduped_posts

    def sort_posts(self, posts):
        """
        Sort posts as required.

        :param posts: Unsorted queryset
        :returns: Sorted queryset
        """
        valid_sorts = {
            'new': '-published_datetime',
            'hot': 'hot',
            'id': '-id'
        }

        return self._sort_posts(posts, valid_sorts, 'id')


class ActivityView(CreateAPIView):
    """
    Store post activity in the database.
    """
    serializer_class = UserActivitySerializer
    queryset = UserActivity.objects.all()

    def perform_create(self, serializer):
        activity = Activity.objects.get(activity="View")
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user, activity=activity)
        else:
            serializer.save(activity=activity)


class FavoriteView(CreateAPIView):
    """
    Store post bookmark in the database.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = UserFavoriteSerializer
    queryset = Favorite.objects.all()

    def perform_create(self, instance):
        data = instance.validated_data

        bookmark = self.queryset.filter(user=self.request.user,
                                        post=data['post'])

        if not bookmark:
            instance.save(user=self.request.user)
        else:
            bookmark[0].delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
