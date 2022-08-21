#!/bin/bash

# Check out:
# https://medium.com/google-cloud/https-with-cert-manager-on-gke-49a70985d99b
# for a rundown on why we use this (dns over http01)

set -x

GCP_PROJECT=$(gcloud config get-value project)

gcloud iam service-accounts create dns-admin \
    --display-name=dns-admin \
    --project=${GCP_PROJECT}

gcloud iam service-accounts keys create ./gcp-dns-admin.json \
    --iam-account=dns-admin@${GCP_PROJECT}.iam.gserviceaccount.com \
    --project=${GCP_PROJECT}

gcloud projects add-iam-policy-binding ${GCP_PROJECT} \
    --member=serviceAccount:dns-admin@${GCP_PROJECT}.iam.gserviceaccount.com \
    --role=roles/dns.admin

# Create the secret on the cluster once this is done
kubectl create secret generic cert-manager-credentials \
    --from-file=./gcp-dns-admin.json
