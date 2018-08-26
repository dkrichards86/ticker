from rest_framework.serializers import (ModelSerializer, SlugRelatedField,
                                        PrimaryKeyRelatedField, ValidationError,
                                        DateTimeField, IntegerField, CharField,
                                        SerializerMethodField)
import feedparser
from feed.models import (UserCategory, UserFeed, Status, Post, UserActivity,
                         Similarity, FeedUrl, DefaultCategory, Favorite)


class UserFilteredPrimaryKeyRelatedField(PrimaryKeyRelatedField):
    def get_queryset(self):
        request = self.context.get('request', None)
        queryset = super(UserFilteredPrimaryKeyRelatedField, self).get_queryset()

        if not request or not queryset:
            return None

        return queryset.filter(curator=request.user)


class UserCategorySerializer(ModelSerializer):
    class Meta:
        model = UserCategory
        fields = ('id', 'title', 'ordinal')


class DefaultCategorySerializer(ModelSerializer):
    class Meta:
        model = DefaultCategory
        fields = ('id', 'title', 'ordinal')


class UserFeedSerializer(ModelSerializer):
    url = SlugRelatedField(read_only=True, slug_field='url')
    category = UserCategorySerializer(read_only=True)

    category_id = IntegerField(write_only=True)
    feed_url = CharField(write_only=True)

    class Meta:
        model = UserFeed
        fields = ('id', 'title', 'url', 'category', 'feed_url', 'category_id')

    def validate(self, data):
        try:
            valid_cat = UserCategory.objects.get(id=data['category_id'],
                                                 curator=self.context['request'].user)
        except UserCategory.DoesNotExist:
            raise ValidationError("Invalid Category ID")

        try:
            _feed_parse = feedparser.parse(data['feed_url'])
        except:
            raise ValidationError("Feed cannot be parsed")

        if not _feed_parse.entries:
            raise ValidationError("Feed cannot be parsed")

        valid_feed_url, _ = FeedUrl.objects.get_or_create(url=data['feed_url'])

        return {
            'title': data['title'],
            'category': valid_cat,
            'url': valid_feed_url
        }


class UserFeedPostSerializer(ModelSerializer):
    class Meta:
        model = UserFeed
        fields = ('title', 'category', 'url',)


class FeedStatusSerializer(ModelSerializer):
    feed = SlugRelatedField(read_only=True, slug_field='url')

    class Meta:
        model = Status
        fields = ('id', 'feed', 'update_datetime')


class SimilaritySerializer(ModelSerializer):
    class Meta:
        model = Similarity
        fields = ('source', 'related')


class PostFeedSerializer(ModelSerializer):
    source = SlugRelatedField(read_only=True, slug_field='title')

    class Meta:
        model = UserFeed
        fields = ('source',)


class NestedPostSerializer(ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'title',  'link')


class PostSerializer(ModelSerializer):
    published_datetime = DateTimeField()
    feed = SerializerMethodField()
    is_bookmark = SerializerMethodField()

    def get_feed(self, post):
        qs = UserFeed.objects.filter(url=post.feed_url)
        serializer = UserFeedPostSerializer(instance=qs, many=True)
        return serializer.data

    def get_is_bookmark(self, post):
        request = self.context.get('request', None)

        if not request:
            return False

        if not request.user.is_authenticated:
            return False

        return Favorite.objects.filter(user=request.user, post=post).exists()

    class Meta:
        model = Post
        fields = ('id', 'title', 'link', 'link_hash', 'published_datetime',
                  'feed', 'is_bookmark',)


class UserActivitySerializer(ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ('post',)


class UserFavoriteSerializer(ModelSerializer):
    class Meta:
        model = Favorite
        fields = ('post',)
