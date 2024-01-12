#!/bin/bash


sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates gnupg curl sudo
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get update && sudo apt-get install google-cloud-cli


# installation of the kubectl 

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl


read -p "Enter the GKE cluster zone: " cluster_zone
read -p "Enter the GCP project ID: " project_id
read -p "Enter the name of the GKE cluster: " cluster_name


cluster_context="gke_${project_id}_${cluster_zone}_${cluster_name}"

if [ "$cluster_context" == "$(kubectl config current-context)" ]; then
    echo "The project '$project_id' is already set in the kubeconfig."
else
   echo "The current project in kubeconfig is different $(kubectl config current-context) while you are trying to set $cluster_context"
   echo "setting the new context"
   gcloud container clusters get-credentials $cluster_name --zone $cluster_zone --project $project_id
fi


# setting up the cluster gateway resource and the enabling the cluster's node auto-provisioning
gcloud container clusters update $cluster_name --gateway-api=standard  --zone=$cluster_zone

# setting up the cluster node auto scaling 
gcloud container clusters update $cluster_name --enable-autoscaling --min-nodes=1 --max-nodes=55

