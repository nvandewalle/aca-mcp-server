#!/bin/bash

# Post-create script for Azure Container Apps MCP Server dev container
# This script runs after the container is created and dependencies are installed

set -e

echo "🚀 Setting up Azure Container Apps MCP Server development environment..."

# Install global npm packages that are useful for development
echo "📦 Installing global npm packages..."
npm install -g @azure/static-web-apps-cli

# Set up git configuration if not already set
echo "🔧 Configuring git..."
if [ -z "$(git config --global user.name)" ]; then
    echo "⚠️  Git user.name not set. You may want to configure it:"
    echo "   git config --global user.name 'Your Name'"
fi

if [ -z "$(git config --global user.email)" ]; then
    echo "⚠️  Git user.email not set. You may want to configure it:"
    echo "   git config --global user.email 'your.email@example.com'"
fi

# Create .env file from sample if it doesn't exist
if [ ! -f .env ] && [ -f .env.sample ]; then
    echo "📄 Creating .env file from .env.sample..."
    cp .env.sample .env
    echo "✅ .env file created. Please update it with your Azure configuration."
else
    echo "ℹ️  .env file already exists or .env.sample not found"
fi

# Verify Azure CLI installation and suggest login
echo "🔍 Verifying Azure CLI installation..."
if command -v az &> /dev/null; then
    echo "✅ Azure CLI is installed"
    echo "💡 To authenticate with Azure, run: az login"
else
    echo "❌ Azure CLI not found"
fi

# Verify Bicep CLI installation
echo "🔍 Verifying Bicep CLI installation..."
if command -v bicep &> /dev/null; then
    echo "✅ Bicep CLI is installed"
else
    echo "❌ Bicep CLI not found"
fi

# Verify Docker installation
echo "🔍 Verifying Docker installation..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    docker --version
else
    echo "❌ Docker not found"
fi

# Show useful commands
echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "🔧 Useful commands:"
echo "   npm run dev        - Start development server with watch mode"
echo "   npm test          - Run tests"
echo "   npm start         - Start production server"
echo "   docker build .    - Build Docker image"
echo "   az login          - Authenticate with Azure"
echo "   azd up            - Deploy to Azure"
echo ""
echo "📚 Documentation:"
echo "   README.md         - Project documentation"
echo "   docs/             - Additional documentation"
echo "   .devcontainer/    - Development container info"
echo ""