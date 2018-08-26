from django.db import models
from django.contrib.auth.models import User


class FeedUrl(models.Model):
    url = models.CharField(max_length=255)


class Status(models.Model):
    update_datetime = models.DateTimeField()
    feed = models.ForeignKey(FeedUrl, models.CASCADE)
    update_frequency = models.SmallIntegerField()


class DefaultCategory(models.Model):
    title = models.CharField(unique=True, max_length=140)
    slug = models.CharField(max_length=50)
    ordinal = models.SmallIntegerField()


class DefaultFeed(models.Model):
    title = models.CharField(max_length=140)
    category = models.ForeignKey(DefaultCategory, models.CASCADE)
    url = models.ForeignKey(FeedUrl, models.CASCADE)


class UserCategory(models.Model):
    title = models.CharField(max_length=140)
    slug = models.CharField(max_length=50)
    ordinal = models.SmallIntegerField()
    curator = models.ForeignKey(User, models.DO_NOTHING)

    class Meta:
        unique_together = (('title', 'curator'),)


class UserFeed(models.Model):
    title = models.CharField(max_length=140)
    category = models.ForeignKey(UserCategory, models.CASCADE)
    curator = models.ForeignKey(User, models.CASCADE)
    url = models.ForeignKey(FeedUrl, models.CASCADE)


class Post(models.Model):
    title = models.CharField(max_length=255)
    desc = models.TextField()
    link = models.CharField(max_length=255)
    link_hash = models.CharField(max_length=40)
    published_datetime = models.DateTimeField()
    ingested_datetime = models.DateTimeField()
    feed_url = models.ForeignKey(FeedUrl, models.CASCADE, related_name='posts')

    class Meta:
        unique_together = (('link_hash', 'feed_url'),)


class Favorite(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
    post = models.ForeignKey(Post, models.CASCADE, related_name='favorite')

    class Meta:
        unique_together = (('user', 'post'),)


class Activity(models.Model):
    activity = models.CharField(max_length=140)


class UserActivity(models.Model):
    user = models.ForeignKey(User, models.CASCADE, blank=True, null=True)
    post = models.ForeignKey(Post, models.CASCADE, related_name='activity')
    activity = models.ForeignKey(Activity, models.CASCADE)


class Similarity(models.Model):
    score = models.DecimalField(max_digits=5, decimal_places=3)
    related = models.ForeignKey(Post, models.CASCADE, related_name='related')
    source = models.ForeignKey(Post, models.CASCADE, related_name='+')


class SimilarityProcessQueue(models.Model):
    post = models.ForeignKey(Post, models.CASCADE)
