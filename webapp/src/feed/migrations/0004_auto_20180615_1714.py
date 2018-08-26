# Generated by Django 2.0.4 on 2018-06-15 17:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0003_auto_20180614_1428'),
    ]

    operations = [
        migrations.AlterField(
            model_name='defaultfeed',
            name='category',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='feed.DefaultCategory'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='defaultfeed',
            name='url',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feed.FeedUrl'),
        ),
        migrations.AlterField(
            model_name='favorite',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorite', to='feed.Post'),
        ),
        migrations.AlterField(
            model_name='favorite',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='post',
            name='feed_url',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='feed.FeedUrl'),
        ),
        migrations.AlterField(
            model_name='similarity',
            name='related',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='related', to='feed.Post'),
        ),
        migrations.AlterField(
            model_name='similarity',
            name='source',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='feed.Post'),
        ),
        migrations.AlterField(
            model_name='similarityprocessqueue',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feed.Post'),
        ),
        migrations.AlterField(
            model_name='status',
            name='feed',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feed.FeedUrl'),
        ),
        migrations.AlterField(
            model_name='useractivity',
            name='activity',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feed.Activity'),
        ),
        migrations.AlterField(
            model_name='useractivity',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='feed.Post'),
        ),
        migrations.AlterField(
            model_name='useractivity',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userfeed',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feed.UserCategory'),
        ),
        migrations.AlterField(
            model_name='userfeed',
            name='curator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userfeed',
            name='url',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='feed.FeedUrl'),
        ),
    ]