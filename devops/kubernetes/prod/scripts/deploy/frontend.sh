#!/bin/bash

echo "Deploying frontend..."
entro-ci kube:deployment:update frontend
