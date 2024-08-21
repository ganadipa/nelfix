#!/bin/bash

# Run the local setup
run_local() {
    bash ./scripts/run-local.sh
}

# Run the staging setup
run_staging() {
    bash ./scripts/run-staging.sh
}

# Create a development setup
run_dev() {
    gnome-terminal -- bash -c "pnpm build:css; exec bash" &
    gnome-terminal -- bash -c "tsc -p tsconfig.client.json --watch; exec bash" &
    gnome-terminal -- bash -c "pnpm prisma studio; exec bash" &
}

# Run seed in the .env DATABASE_URL
run_seed() {
    nest start --entryFile seed
}

case $1 in
    local)
        run_local
        ;;
    staging)
        run_staging
        ;;
    dev)
        run_dev
        ;;
    seed)
        run_seed
        ;;
esac