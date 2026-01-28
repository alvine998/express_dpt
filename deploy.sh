#!/bin/bash

# BPJS Scrapper API Deploy Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest changes from git
echo "📥 Pulling latest changes from git..."
git pull

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose up --build -d

echo "✅ Deployment complete!"
echo "📊 Checking container status..."
docker compose ps
