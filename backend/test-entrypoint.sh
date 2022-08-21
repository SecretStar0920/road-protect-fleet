#!/usr/bin/env bash
set -x

echo 'Building backend to execute database CLI'
npm run build

export ENV=dev
echo 'Setting up latest database schema'
./cli database:drop
./cli database:sync
rm -rf dist
export ENV=testing
echo 'Running tests'

npm run test:dev:pattern
