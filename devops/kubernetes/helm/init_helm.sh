#!/bin/bash

set -x

kubectl apply -f ./rbac-config.yaml

#sudo snap install helm --channel=2.16/stable --classic

kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding \
    tiller-cluster-rule \
    --clusterrole=cluster-admin \
    --serviceaccount=kube-system:tiller

kubectl patch deploy --namespace kube-system \
    tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
helm init --service-account tiller --upgrade
