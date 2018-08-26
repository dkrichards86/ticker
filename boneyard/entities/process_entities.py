import os
import dataset
import math
import spacy
import textacy
import re
nlp = spacy.load('en')

new_line = re.compile(r'(/\n)')
ws = re.compile(r'\s+')
pos = re.compile(r"('s)")


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
entity_queue_table = db['feed_entityprocessqueue']
entity_table = db['feed_entity']


def tf(doc, word):
    n_appears = len(doc)

    if n_appears == 0:
        return 0

    return doc.count(word) / len(doc)


def idf(docs, word):
    n_containing = sum(1 for blob in docs if word in blob)
    return math.log(len(docs) / (1 + n_containing), 2)


def tfidf(docs, doc, word):
    return tf(doc, word) * idf(docs, word)


def clean(text):
    text = text.encode('ascii', 'ignore').decode('utf-8')
    text = new_line.sub(' ', text)
    text = ws.sub(' ', text)
    return text


def extract(doc):
    exclude_types = ["DATE", "TIME", "CARDINAL", "ORDINAL", "MONEY",
                     "QUANTITY", "NORP", "PERCENT"]

    nes = []
    for ne in textacy.extract.named_entities(doc, exclude_types=exclude_types):
        txt = ne.text.lower()

        txt = " ".join([pos.sub('', t) for t in txt.split()])
        txt = txt.rstrip()

        nes.append(txt)

    return nes


all_recent_posts = [post for post in entity_queue_table.all()]
recent_post_count = len(all_recent_posts)

batch_size = 100
start = 0

while start < recent_post_count:
    end = start + batch_size
    recent_posts = all_recent_posts[start:end]

    doc_tuples = []
    ner = set()
    related = {}
    for recent in recent_posts:
        post = post_table.find_one(id=recent['post_id'])
        if not post['desc']:
            continue

        try:
            _ = related[post['feed_url_id']]
        except KeyError:
            same_source = post_table.find(feed_url_id=post['feed_url_id'],
                                          order_by='-id', _limit=100)
            source_docs = []
            for source_post in same_source:
                if not source_post['desc']:
                    continue

                source_docs.append(extract(nlp(clean(source_post['desc']))))

            post_words = set()
            for source_doc in source_docs:
                for word in source_doc:
                    score = tfidf(source_docs, source_doc, word)
                    if score <= 0.3:
                        post_words.add(word)

            related[post['feed_url_id']] = post_words
        finally:
            post_words = related[post['feed_url_id']]

        nes = extract(nlp(clean(post['desc'])))
        for _ne in nes:
            if _ne not in post_words and len(_ne) < 80:
                ner.add(_ne)

        doc_tuples.append((post['id'], nes))

    docs = [d[1] for d in doc_tuples]
    for post_id, doc in doc_tuples:
        bulk_entities = []
        _post_words = []
        for word in ner:
            score = tfidf(docs, doc, word)
            if score > 0.3 and word not in _post_words:
                _post_words.append(word)
                bulk_entities.append(dict(post_id=post_id, entity=word))

        entity_table.insert_many(bulk_entities)
        bulk_entities = []

        entity_queue_table.delete(post_id=post_id)
    start += batch_size

entity_queue_table.delete()
