#!/bin/bash

echo "Deploying backend..."
entro-ci kube:deployment:update backend
entro-ci kube:deployment:update cron
entro-ci kube:deployment:update admin
