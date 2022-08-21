#!/bin/bash

cd ../../../../document-api

docker build . -t road-protect-renderer
docker tag road-protect-renderer kerren/road-protect-renderer
docker push kerren/road-protect-renderer
