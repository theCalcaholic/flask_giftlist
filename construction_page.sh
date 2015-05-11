#!/bin/bash

NUM_WORKERS=4
ADDRESS=unix:/tmp/gunicorn.progpage.socket # 127.0.0.1:5000

# su thecalcaholic
cd /var/www/progpage
. /var/python/flask/bin/activate
gunicorn main_app:app -w $NUM_WORKERS -b $ADDRESS
