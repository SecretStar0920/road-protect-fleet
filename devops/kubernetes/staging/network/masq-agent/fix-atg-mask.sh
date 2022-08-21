#https://cloud.google.com/kubernetes-engine/docs/how-to/ip-masquerade-agent#config_agent_configmap
#https://github.com/kubernetes-sigs/ip-masq-agent
#https://kubernetes.io/docs/tasks/administer-cluster/ip-masq-agent/

kubectl apply -f ./ip-masq-agent.yaml
kubectl create configmap ip-masq-agent --from-file config --namespace kube-system
