#!/bin/bash
set -x

IP_ADDRESS=$1

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
    --set rbac.create=true \
    --namespace kube-system \
    --set controller.service.loadBalancerIP="$IP_ADDRESS" \
    --set controller.service.externalIPs="{$IP_ADDRESS}" \
    --set controller.service.externalTrafficPolicy=Local
