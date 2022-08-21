#!/usr/bin/env bash
READY=$(kubectl get pods | grep admin | wc -l)

kubectl get pods | grep "Evicted" | awk ' { print $1 } ' | xargs -L 1  kubectl delete pod

while [ $READY -ne 1 ]
do
    echo 'Waiting for single admin pod'
    kubectl get pods | grep "Evicted" | awk ' { print $1 } ' | xargs -L 1  kubectl delete pod
    READY=$(kubectl get pods | grep admin | wc -l)
done

echo 'Backend Ready for Migration'
echo "Selecting admin pod"
BACKEND_POD=$(kubectl get pods | grep -oP 'admin-[a-z0-9\-]+' | awk ' NR<2 { print $1 } ')

echo "Found admin pod: $BACKEND_POD"
echo "Running Migration"
kubectl exec -it "$BACKEND_POD" -- /bin/bash -c "node dist/cli/cli.js database:migrate --force"
