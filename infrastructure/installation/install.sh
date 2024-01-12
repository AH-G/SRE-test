#!/bin/bash



# first install the gcloud. 
# install kubectl etc on the machine. 
# install other things after that. 

# installation of the gcloud cli utility


# Check if gcloud is installed
if command -v gcloud >/dev/null 2>&1; then
    echo "gcloud is installed. Skipping the installation"
else
    echo "Installing gcloud."
    ./gcloud-setup.sh
fi


#installation of the namespaces.
kubectl apply -f ../namespaces/

#installation of prometheus
kubectl apply -f ../monitoring/1-prometheus-operator-crd/
kubectl apply -f ../monitoring/2-prometheus-operator/
kubectl apply -f ../monitoring/3-prometheus/

#installation of prometheus adapter through helm. 

# installation of helm. 
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm

# deployment of the frontend application. 

kubectl apply -f ../frontend-nextjs/

# deployment of flask application 

kubectl apply -f ../flask/

# deployment of the prometheus adapater through helm. 

helm install custom-metrics prometheus-community/prometheus-adapter --namespace=monitoring --version=2.14.2 --values=../monitoring/values.yaml


echo "SRE-TEST is successfully deployed"
