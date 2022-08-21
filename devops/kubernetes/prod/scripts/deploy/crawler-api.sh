#!/bin/bash

echo "Deploying Crawler API..."
entro-ci kube:deployment:update crawler-api
