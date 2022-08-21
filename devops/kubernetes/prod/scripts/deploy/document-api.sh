#!/bin/bash

echo "Deploying Document API..."
entro-ci kube:deployment:update document-api
