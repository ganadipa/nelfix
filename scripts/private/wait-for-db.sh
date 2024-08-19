#!/bin/sh

until nc -z -v -w30 $(echo $DATABASE_URL | sed -E 's/.*\/\/([^:]+):[^@]+@([^:]+):([0-9]+).*/\2 \3/') 2>/dev/null
do
  echo "Waiting for Postgres to be ready..."
  sleep 2
done

echo "Postgres is ready!"
