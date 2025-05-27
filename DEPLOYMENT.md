# Deployment Guide

This document outlines the steps to deploy the application using Docker and Azure.

## Prerequisites

1. Docker installed locally
2. Azure CLI installed
3. Pulumi CLI installed
4. Node.js 18.x

## Local Development

1. Clone the repository
2. Navigate to the project directory
3. Copy `.env.example` to `.env` and update the values
4. Start the application:
   ```bash
   docker-compose up --build
   ```

The application will be available at `http://localhost:3000`

## CI/CD Pipeline

The GitHub Actions workflow will automatically build and deploy the application when changes are pushed to the `main` branch.

### Required Secrets

Add these secrets to your GitHub repository:

1. `AZURE_CREDENTIALS`: Azure service principal credentials
2. `PULUMI_ACCESS_TOKEN`: Pulumi access token
3. `DOCKERHUB_USERNAME`: Docker Hub username
4. `DOCKERHUB_TOKEN`: Docker Hub access token

### Manual Deployment

To deploy manually:

1. Build the Docker image:
   ```bash
   docker build -t your-username/next-app .
   ```

2. Push to Docker Hub:
   ```bash
   docker push your-username/next-app:latest
   ```

3. Deploy to Azure:
   ```bash
   az webapp config container set \
     --name your-webapp-name \
     --resource-group your-resource-group \
     --docker-custom-image-name your-username/next-app:latest
   ```

## Infrastructure

Infrastructure is managed using Pulumi. To make changes:

1. Install dependencies:
   ```bash
   cd infra
   npm install
   ```

2. Deploy changes:
   ```bash
   pulumi up
   ```

## Monitoring

- Application logs: Available in Azure Portal under the Web App's Log Stream
- Database metrics: Available in Azure Portal under the SQL Database
- Application metrics: Available in Application Insights
