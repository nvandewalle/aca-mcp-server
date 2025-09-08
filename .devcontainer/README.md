# Development Container Configuration

This directory contains the configuration for a development container that provides a consistent development environment for the Azure Container Apps MCP Server project.

## What's Included

### Base Environment
- **Node.js 18** - JavaScript runtime for running the MCP server
- **Debian Bullseye** - Stable Linux distribution as the base OS

### Azure Tools
- **Azure CLI** - Command-line interface for managing Azure resources
- **Bicep CLI** - Domain-specific language for deploying Azure resources
- **Azure Developer CLI (azd)** - Tool for developing and deploying applications on Azure

### Development Tools
- **Docker-in-Docker** - Build and run containers within the development container
- **GitHub CLI** - Command-line interface for GitHub operations
- **Git LFS** - Support for Git Large File Storage

### VS Code Extensions
- **Azure Extensions**: Account, Resource Groups, Container Apps, Cosmos DB, Bicep
- **Development Extensions**: Docker, ESLint, Prettier, TypeScript, YAML
- **GitHub Extensions**: Copilot, Actions, Repos
- **Kubernetes Tools** - For container orchestration support

## Usage

### With VS Code
1. Install the "Dev Containers" extension
2. Open the repository in VS Code
3. When prompted, click "Reopen in Container" or use Ctrl+Shift+P → "Dev Containers: Reopen in Container"

### With GitHub Codespaces
1. Click the "Code" button in the GitHub repository
2. Select the "Codespaces" tab
3. Click "Create codespace on main"

## Features

- **Port Forwarding**: Automatic forwarding of ports 3000 (MCP Server) and 8080 (Health Check)
- **Auto-install**: Dependencies are automatically installed with `npm install`
- **Docker Support**: Full Docker functionality for building and testing containers
- **Azure Integration**: Pre-configured Azure tools and authentication
- **Code Formatting**: Automatic formatting on save with Prettier

## Environment Variables

The development container will use any `.env` file in the root directory. Copy `.env.sample` to `.env` and configure your Azure settings:

```bash
cp .env.sample .env
# Edit .env with your Azure configuration
```

## Running the Application

Once the container is running:

```bash
# Start the development server
npm run dev

# Run tests
npm test

# Build Docker image
docker build -t aca-mcp-server .

# Deploy to Azure (requires Azure login)
azd up
```

## Azure Authentication

To authenticate with Azure within the container:

```bash
# Login to Azure
az login

# Login to Azure Developer CLI
azd auth login
```

The container includes Docker socket mounting to support building and running containers during development.