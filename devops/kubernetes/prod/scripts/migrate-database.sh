#!/usr/bin/env bash
READY=$(kubectl get pods | grep backend | wc -l)

while [ $READY -ne 1 ]
do
    echo 'Waiting for single backend pod'
    READY=$(kubectl get pods | grep backend | wc -l)
done

echo 'Backend Ready for Migration'
echo "Selecting backend pod"
BACKEND_POD=$(kubectl get pods | grep -oP 'backend-[a-z0-9\-]+' | awk ' NR<2 { print $1 } ')

echo "Found backend pod: $BACKEND_POD"
echo "Running Migration"
kubectl exec -it "$BACKEND_POD" -- /bin/bash -c "node dist/cli/cli.js database:migrate --force"
