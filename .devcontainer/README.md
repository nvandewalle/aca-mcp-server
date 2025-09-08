# DevContainer Configuration

This devcontainer provides a complete development environment for the ACA MCP Server project.

## Included Tools

### Azure Tools
- **Azure CLI** - Command-line interface for Azure
- **Azure Developer CLI (azd)** - Modern developer CLI for Azure (installed via postCreateCommand)

### Development Tools
- **Node.js 20** - JavaScript runtime for MCP server development
- **Python 3.11** - Alternative runtime for MCP server development
- **Docker** - Containerization platform (Docker-in-Docker)
- **Git** - Version control
- **GitHub CLI** - Command-line interface for GitHub

### VS Code Extensions
- Azure Account
- Azure Container Apps
- Azure Resource Groups  
- Docker
- Python (with pylint)
- TypeScript
- Prettier (code formatting)
- JSON support

## Usage

1. Open this repository in VS Code
2. When prompted, click "Reopen in Container" or use the Command Palette:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Dev Containers: Reopen in Container"
   - Select the option

3. The container will build and install all required tools automatically

## Available Ports

The following ports are forwarded for development:
- `3000` - Common web server port
- `8000` - Alternative web server port  
- `8080` - Alternative web server port

## Getting Started

Once the container is running, you can:

1. **Check Azure CLI**: `az --version`
2. **Check Azure Developer CLI**: `azd version`
3. **Check Docker**: `docker --version`
4. **Login to Azure**: `az login`
5. **Initialize Azure Developer CLI**: `azd auth login`

## Development Workflow

This environment is optimized for developing MCP (Model Context Protocol) servers that deploy to Azure Container Apps. The included tools support:

- Building and testing MCP servers locally
- Containerizing applications with Docker
- Deploying to Azure using azd and Azure CLI
- Managing Azure resources from the command line