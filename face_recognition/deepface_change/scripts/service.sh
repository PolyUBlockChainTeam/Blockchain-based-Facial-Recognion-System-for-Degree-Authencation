#!/usr/bin/env bash
cd ../deepface/api/src

# run the service with flask - not for production purposes
# python api.py

# run the service with gunicorn - for prod purposes
# gunicorn --workers=1 --timeout=3600 --bind=0.0.0.0:5005 "app:create_app()"
waitress-serve --listen=127.0.0.1:5000 predict:app