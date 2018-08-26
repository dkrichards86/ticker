import os
import feedparser
from datetime import timedelta, datetime
import dataset
from collector.post_parser import PostParser


DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_HOST = os.environ['DB_HOST']
DB_PORT = os.environ['DB_PORT']
DB_NAME = os.environ['DB_NAME']

db_conn = 'postgresql://{user}:{password}@{host}:{port}/{name}'.format(
    user=DB_NAME, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT, name=DB_NAME
)
db = dataset.connect(db_conn)
status_table = db['feed_status']
post_table = db['feed_post']
feed_url_table = db['feed_feedurl']
similarity_queue_table = db['feed_similarityprocessqueue']

MIN_UPDATE_FREQ = 3
MAX_UPDATE_FREQ = 10

process_now = datetime.now().astimezone()
due_feeds = []
for feed in status_table.all(order_by='id'):
    feed_offset = 2 ** feed['update_frequency']

    if feed['update_datetime'] <= process_now - timedelta(minutes=feed_offset):
        due_feeds.append(feed)

collection_offset = process_now - timedelta(days=3)

# Get all post link_hashes
existing_posts = post_table.all()
link_hashes = list(post['link_hash'] for post in existing_posts)

for due in due_feeds:
    feed_url = feed_url_table.find_one(id=due['feed_id'])['url']

    # Get the actual feed data
    feed_data = feedparser.parse(feed_url)

    # Prep the bulk storage containers
    bulk_post_queue = []
    new_post_count = 0
    # For each entry in the RSS feed, parse the content then update
    # the database. First we create a new post. We then build entities
    # and Feed <-> Post entries.
    for entry in feed_data.entries:
        try:
            post = PostParser(entry)
        except AttributeError:
            # This post was missing critical entries.
            continue

        # If the post has a published datetime, make it TZ aware.
        # Otherwise set the published time to now.
        try:
            post_datetime = post.datetime.astimezone()
        except:
            continue

        # discard entries with irregular dates
        if post_datetime > process_now or post_datetime < collection_offset:
            continue

        if len(post.title) > 255 or len(post.link) > 255:
            continue

        if post.link_hash not in link_hashes:
            # If this particular post has not been processed
            # previously, process it.
            link_hashes.append(post.link_hash)

            # # Build and save the post object.
            post_dict = dict(
                title=post.title, desc=post.description,
                link=post.link, link_hash=post.link_hash,
                published_datetime=post_datetime,
                feed_url_id=due['feed_id'],
                ingested_datetime=datetime.now()
            )
            new_post = post_table.insert(post_dict)
            new_post_count += 1

            # # Build associated Feed <-> Post entries.
            bulk_post_queue.append(dict(post_id=new_post))
        else:
            # If this post URL has been processed, see if it has a
            # corresponding mapping to all associated feeds
            existing_posts = post_table.count(link_hash=post.link_hash,
                                              feed_url_id=due['feed_id'])

            if existing_posts == 0:
                # If the post is not associated with this feed utl, add it.
                post_dict = dict(
                    title=post.title, desc=post.description,
                    link=post.link, link_hash=post.link_hash,
                    published_datetime=post_datetime,
                    feed_url_id=due['feed_id'],
                    ingested_datetime=datetime.now()
                )
                new_post = post_table.insert(post_dict)

    # Save the bulk objects
    similarity_queue_table.insert_many(bulk_post_queue)

    if new_post_count > 0 and due['update_frequency'] > MIN_UPDATE_FREQ:
        update_frequency = due['update_frequency'] - 1
    elif new_post_count == 0 and due['update_frequency'] < MAX_UPDATE_FREQ:
        update_frequency = due['update_frequency'] + 1
    else:
        update_frequency = due['update_frequency']

    # Update the record in the status table
    status_data = dict(feed_id=due['feed_id'], update_datetime=datetime.now(),
                       update_frequency=update_frequency)
    status_table.update(status_data, ['feed_id'])
