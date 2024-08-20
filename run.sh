#!/bin/bash

run_local() {
    bash ./scripts/run-local.sh
}

run_staging() {
    bash ./scripts/run-staging.sh
}

run_dev() {
    gnome-terminal -- bash -c "pnpm build:css; exec bash" &
    gnome-terminal -- bash -c "tsc -p tsconfig.client.json; exec bash" &
    gnome-terminal -- bash -c "pnpm prisma studio; exec bash" &
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
esac