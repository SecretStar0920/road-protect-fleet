#!/bin/bash

cd ../../../../document-api

docker build . -t road-protect-document-api
docker tag road-protect-document-api kerren/road-protect-document-api
docker push kerren/road-protect-document-api
