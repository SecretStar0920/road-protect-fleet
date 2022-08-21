#!/usr/bin/env bash

# Configuring gcloud and docker auth
echo $GCLOUD_API_KEYFILE > ~/.gcloud-api-key.json
gcloud auth activate-service-account --key-file ~/.gcloud-api-key.json
gcloud auth configure-docker

gcloud container clusters get-credentials fleet-production --zone europe-west1-b --project fleet-260107
kubectl config rename-context gke_fleet-260107_europe-west1-b_fleet-production prod

gcloud container clusters get-credentials fleet-staging --zone europe-west1-b --project fleet-260107
kubectl config rename-context gke_fleet-260107_europe-west1-b_fleet-staging staging
