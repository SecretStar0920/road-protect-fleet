#!/bin/bash

echo "Deploying OCR..."
entro-ci kube:deployment:update queue-workers
