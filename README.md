# Sre-Test

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
