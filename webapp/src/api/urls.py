from django.urls import include, path
from api.views import (UserCategoryViewSet, FeedsView, PostsView, ActivityView,
                       UserFeedViewSet, SimilarPostsView, FavoriteView,
                       BookmarkedPostsView, FeedStatusView)

from rest_framework import routers

app_name = 'api'

router = routers.DefaultRouter()
router.register(r'categories', UserCategoryViewSet, base_name='category')
router.register(r'feeds', UserFeedViewSet, base_name='feedmap')

urlpatterns = [
    path('meta/feeds/', FeedsView.as_view()),
    path('meta/status/', FeedStatusView.as_view()),
    path('bookmarks/', BookmarkedPostsView.as_view()),
    path('posts/', PostsView.as_view()),
    path('posts/activity/', ActivityView.as_view()),
    path('posts/bookmarks/', FavoriteView.as_view()),
    path('similar/', SimilarPostsView.as_view()),
    path('', include(router.urls)),
]
