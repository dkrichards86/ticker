from django.core.management.base import BaseCommand
from django.utils.timezone import now
from datetime import timedelta
import csv
import os
from feed.models import FeedUrl, Status


class Command(BaseCommand):
    def handle(self, *args, **options):
        command_dir = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(command_dir, 'manifests', 'feeds.csv')

        status_time = now()
        status_offset = status_time - timedelta(days=1)

        with open(filepath) as f:
            reader = csv.DictReader(f)
            for row in reader:
                feed = FeedUrl(url=row['url'])
                feed.save()

                status = Status(feed=feed, update_datetime=status_offset)
                status.save()
