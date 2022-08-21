echo "Installing gcloud"
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get install apt-transport-https ca-certificates gnupg
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt-get update && sudo apt-get install google-cloud-sdk
gcloud init

echo
echo "Installing kubectl"
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

echo
echo "Getting credentials for production"
gcloud container clusters get-credentials fleet-production --zone europe-west1-b --project fleet-260107
kubectl config rename-context gke_fleet-260107_europe-west1-b_fleet-production prod

echo
echo "Getting credentials for staging"
gcloud container clusters get-credentials fleet-staging --zone europe-west1-b --project fleet-260107
kubectl config rename-context gke_fleet-260107_europe-west1-b_fleet-staging staging
