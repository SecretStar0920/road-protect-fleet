# Nginx Ingress

I hit a problem where the nginx-ingress repo did not support our Kubernetes version (ours was too old). Since we couldn't update on GCP, we needed to install from the repo.

```bash
git clone https://github.com/kubernetes/ingress-nginx
git checkout controller-v0.35.0
cd charts/nginx-ingress

helm install ingress-nginx . \
    --set rbac.create=true \
    --namespace kube-system \
    --set controller.service.loadBalancerIP="35.205.60.65" \
    --set controller.service.externalIPs="{35.205.60.65}" \
    --set controller.service.externalTrafficPolicy=Local
```


After this, I also had to run:

```bash
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
```

Before running:
```bash
kubectl apply -f ingress.yaml
```

https://github.com/kubernetes/ingress-nginx/issues/5583#issuecomment-647880723
