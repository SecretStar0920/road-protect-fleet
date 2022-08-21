#!/bin/bash

echo "Deploying Document Renderer..."
entro-ci kube:deployment:update document-renderer
