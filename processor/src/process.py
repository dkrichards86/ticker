import os
from datetime import datetime, timedelta
import dataset
from processor.similarity_identifier import SimilarityIdentifier

DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_HOST = os.environ['DB_HOST']
DB_PORT = os.environ['DB_PORT']
DB_NAME = os.environ['DB_NAME']

db_conn = 'postgresql://{user}:{password}@{host}:{port}/{name}'.format(
    user=DB_NAME, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT, name=DB_NAME
)
db = dataset.connect(db_conn)
post_table = db['feed_post']
similarity_queue_table = db['feed_similarityprocessqueue']
similarity_table = db['feed_similarity']

enqueued_post_count = similarity_queue_table.count()
discarded_posts = []
if enqueued_post_count > 0:
    process_now = datetime.now()
    process_offset = process_now - timedelta(days=2)
    recent_posts = post_table.find(post_table.table.columns.published_datetime >= process_offset)

    all_docs = set()
    recent_post_map = {}
    for post in recent_posts:
        all_docs.add((post['id'], ". ".join((post['title'], post['desc']))))
        recent_post_map[post['id']] = post

    new_docs = set()
    enqueued_posts = similarity_queue_table.all()
    for enqueued_post in enqueued_posts:
        try:
            post = recent_post_map[enqueued_post['post_id']]
        except KeyError:
            discarded_posts.append(enqueued_post['post_id'])
            continue

        new_docs.add((post['id'], ". ".join((post['title'], post['desc']))))

    sims = SimilarityIdentifier(new_docs, all_docs, threshold=0.85)
    similarities = sims.calculate()

    similar_posts = []
    for enqueued_id, _ in new_docs:
        try:
            related_ids = similarities[enqueued_id]
        except KeyError:
            related_ids = []

        for related_id, score in sorted(related_ids, key=lambda x: x[0], reverse=True):
            related = recent_post_map[related_id]
            similar_posts.append(dict(source_id=enqueued_id,
                                      related_id=related['id'],
                                      score=score))
            similar_posts.append(dict(source_id=related['id'],
                                      related_id=enqueued_id,
                                      score=score))

        similarity_queue_table.delete(post_id=enqueued_id)

    similarity_table.insert_many(similar_posts)

for discarded_post in discarded_posts:
    similarity_queue_table.delete(post_id=discarded_post)
