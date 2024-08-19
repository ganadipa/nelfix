#!/bin/sh

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Extract the host and port from the DATABASE_URL
host_port=$(echo $DATABASE_URL | sed -E 's/.*\/\/([^:]+):[^@]+@([^:]+):([0-9]+).*/\2 \3/')

# Wait until Postgres is ready
until nc -z -v -w30 $host_port 2>/dev/null
do
  echo "Waiting for Postgres to be ready..."
  sleep 2
done

echo "Postgres is ready!"
