# SRE-Test

Welcome to the GitHub repository of SRE-test, an end-to-end solution to optimally resize the images. This README provides all the information regarding the design, the approaches and the infrastructure considered to run this solution in the production environment.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Considered Approaches](#considered-approaches)

## Introduction
SRE-Test is built with a focus on user-friendliness, efficiency, and scalability. It leverages the latest web and infrastrcuture technologies to make sure that the solution is fully optimized and cost effective. 
SRE-Test is developed on the Flask based Framework and serve as a backend application. A demo frontend project, based on Nextjs, is also created to showcase the effectiveness of the solution. The solution takes different parameters in its API route along with the URL of the image and resize it accordingly. 
The solution is designed as a microservice and therefore dockerfiles are include that can help to containerize this application. 

The solution eventually is deployed on the GKE cluster with pod autoscaling and node autoscaling enabled. The solution also implements metrics collection at the application level. These metrics are then collected by Prometheus to calculate the current load in terms of Requests per second at all endpoints.
These metrics are eventually by the HorizontalPodAutoScaler to scale the pods within the cluster. 

## Features
- Image resizer
- GKE deployment
- Metrics generation
- Prometheus integration.
- Automatic Pod scaling based on the network load.
- Automatic node scaling based on the Hardware resources. 

## Installation
To install MyApp, follow these steps:

1. Clone the repository:


## Considered Approaches

- [Standard Pod Scaling based on Resource Utilization](#standard-pod-scaling-based-on-resource-utilization)
- [Load Balancing Gateway traffic metrics based Pod Scaling](#load-balancing-gateway-traffic-metrics-based-pod-scaling)
- [Application level metrics based Pod Scaling](#application-level-metrics-based-pod-scaling)
- [AutoPilot Clusters](#autopilot-clusters)

It is important to note that the last approach handles the node autoscaling on its own. All the other approaches focus more on the pod autoscaling. In all of these approaches node autoscaling is implemented by enabling node scaling in the GKE standard cluster node. The command to achieve that is given below. 

```
gcloud container cluster update sre-test --enable-autoscaling --min-nodes=1 --max-nodes=55
```

### Standard Pod Scaling based on Resource Utilization
GKE offers horizontal pod scaling actions based on the CPU and memory utilizations. These depend on the resource requests and limitations defined within GKE clusters and can be activated/deployed with the following command. 

```
kubectl autoscale deployment sre-frontend --max=100 --min=1 --cpu-percent=70
```

The problem with approach that pod scaling was that we were not really sure about the amount of resources that the pod would need to perform optimally. 

### Load Balancing Gateway traffic metrics based Pod Scaling

GKE also offers other metrics like gateway level metrics which can give valuable insights about the current traffic throughput. For this to work, we have to deploy gateway resource within the kubernetes cluster and create the HTTP route to the frontend service. Rate limiter would be applied on the service which would the HPA to make the scaling decisions. Based on the number of connections of the service which is serving as the backend to the gateway resource, the HPA scales in or scales out. That service in our case is called sre-frontend-svc. Rate limiation is applied through the annotation. The yaml configuration of the service is given below. 

```
apiVersion: v1
kind: Service
metadata:
  name: sre-frontend-svc
  namespace: application
  labels:
    app: sre-frontend
  annotations:
    networking.gke.io/max-rate-per-endpoint: "100"
spec:
  selector:
    app: sre-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: http
      name: http
```

The problem with this approach is that while this can scale the frontend application, the backend application, which is the real application in this case cannot scale appropriately. For both of the applications to scale appropriately, we would need to collect the metrics at the application layer. 

### Application level metrics based Pod Scaling

The application level metrics based pod scaling is the approach that we have chosen for our application. We are gathering each time index.js page is accessed in the frontend application. Those metrics are then polled by the Prometheus server deployed in the monitoring namespace. The metrics are polled through Kubernetes ServiceMonitor resource, and then sent to Prometheus server through Prometheus operator. Prometheus adapter, then, sends those metrics to the HPA deployed in the application namespace. The metrics that are gathered at the frontend are `http_requests_total` while the metrics that are collected at the backend application are `python_requests_total`

### AutoPilot Clusters

AutoPilot clusters handles the pod and node scaling and charges the user on the basis of resources requested by each pod. As shown in the report provided in the repo, the cost to operate AutoPilot clusters is too high to justify its advantages over the Standard GKE clusters. 
