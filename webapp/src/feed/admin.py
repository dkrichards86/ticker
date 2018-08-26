from django.contrib import admin
from feed.models import Activity, DefaultCategory, DefaultFeed

admin.site.register(Activity)

admin.site.register(DefaultCategory)
admin.site.register(DefaultFeed)
