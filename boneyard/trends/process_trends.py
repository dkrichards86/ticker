import os
import dataset
from datetime import datetime, timedelta
from processor.trend_setter import TrendSetter


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
entity_table = db['feed_entity']
trend_table = db['feed_trend']


def floor_hour(dt):
    return dt.replace(microsecond=0, second=0, minute=0)


def daterange_generator(start_date, end_date, delta):
    current_date = start_date
    while current_date < end_date:
        yield current_date
        current_date += delta


floored_hour = floor_hour(datetime.now().astimezone())
end_datetime = floored_hour
start_datetime = end_datetime - timedelta(days=7)
list_delta = timedelta(hours=1)

recent_posts = post_table.find(post_table.table.columns.published_datetime >= start_datetime,
                               post_table.table.columns.published_datetime < end_datetime)
recent_post_ids = [post['id'] for post in recent_posts]

id_str = ",".join([str(post) for post in recent_post_ids])
statement = 'SELECT id, entity, post_id FROM feed_entity WHERE post_id IN ({})'.format(id_str)
entities = list(db.query(statement))

keys = set(entity['entity'] for entity in entities if entity['entity'])
timesteps = list(daterange_generator(start_datetime, end_datetime, list_delta))
time_dict = {}
base_timstep_dict = {key: 0 for key in keys}
for dt in timesteps:
    time_dict[str(dt)] = {**base_timstep_dict}

for entity in entities:
    ent_post = post_table.find_one(id=entity['post_id'])
    entity_time = str(floor_hour(ent_post['published_datetime']))

    try:
        _ = time_dict[entity_time][entity['entity']]
    except KeyError:
        time_dict[entity_time][entity['entity']] = 0
    finally:
        time_dict[entity_time][entity['entity']] += 1

timestep_values = {}
new_trend_scores = []
for key in keys:
    timestep_values[key] = []

    for step in timesteps:
        value = time_dict[str(step)][key]
        timestep_values[key].append(value)

    ts = TrendSetter(timestep_values[key])
    score = round(float(ts.calculate()), 3)
    if score <= 0:
        continue

    _trend = dict(entity=key, score=score, calculation_datetime=floored_hour)
    new_trend_scores.append(_trend)

trend_table.insert_many(new_trend_scores)
