#!/bin/sh

# Run Prisma commands
pnpx prisma generate
pnpx prisma migrate dev

# Start the application
exec "$@"
