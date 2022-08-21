kubectl config use-context prod

cd ./storage-claims || exit
kubectl apply -f .

cd ../redis || exit
kubectl apply -f .

cd ../backend || exit
kubectl apply -f .

cd ../document-api || exit
kubectl apply -f .

cd ../documentation || exit
kubectl apply -f .

cd ../document-renderer || exit
kubectl apply -f .

cd ../frontend || exit
kubectl apply -f .

cd ../metabase || exit
kubectl apply -f .

cd ../ingress || exit
kubectl apply -f .
