#!/bin/bash

echo "starting"

python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate --noinput
# gunicorn ttt.wsgi:application --bind 0.0.0.0:8000 --reload
python3 manage.py runserver 0.0.0.0:8000 