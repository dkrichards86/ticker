#!/bin/bash

# wait for postgres to be ready
until psql -h postgres -U ticker -c '\q'; do
   >&2 echo "Postgres is unavailable - sleeping"
   sleep 1
done

python ./manage.py runserver 0.0.0.0:8000
