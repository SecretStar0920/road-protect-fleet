#!/bin/bash

echo "Deploying Documentation..."
entro-ci kube:deployment:update documentation
