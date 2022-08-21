#!/bin/bash

set -e

echo 'Building backend to execute database CLI'
npm run build

export ENV=dev
echo 'Setting up latest database schema'
./cli database:drop
./cli database:sync

rm -rf dist

npm run start

# In the deployment docker file, you'll see a jest-test service that waits for this
# to load up and listen on port 8080 before starting.
