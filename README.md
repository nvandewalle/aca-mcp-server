# Azure Container Apps MCP Server

A comprehensive Model Context Protocol (MCP) server built for Azure Container Apps that manages team members and their skills. This application demonstrates modern cloud-native development patterns using Azure services with managed identity authentication.

## 🚀 Features

- **MCP Server Implementation**: Full Model Context Protocol server with Streamable HTTP transport
- **Team Management**: Complete CRUD operations for team members and their skills
- **Azure Native**: Built specifically for Azure Container Apps with Cosmos DB storage
- **Managed Identity**: Secure authentication without managing credentials
- **Infrastructure as Code**: Complete Bicep templates following Azure Developer CLI best practices
- **CI/CD Ready**: GitHub Actions workflow for automated deployment
- **Containerized**: Docker-ready with health checks and security best practices

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  MCP Client     │───▶│  Container App   │───▶│   Cosmos DB     │
│  (Claude, etc.) │    │  (Node.js API)   │    │ (Team Members)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ Managed Identity │
                       │  (Authentication)│
                       └──────────────────┘
```

## 🛠️ Technology Stack

- **Backend**: Node.js with Express
- **MCP SDK**: @modelcontextprotocol/sdk
- **Database**: Azure Cosmos DB (SQL API)
- **Hosting**: Azure Container Apps
- **Authentication**: Azure Managed Identity
- **Infrastructure**: Azure Bicep templates
- **CI/CD**: GitHub Actions with Azure Developer CLI
- **Containerization**: Docker with multi-stage builds

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Azure Developer CLI (azd)](https://docs.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd)
- An Azure subscription with appropriate permissions

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd aca-mcp-server
npm install
```

### 2. Configure Environment

```bash
cp .env.sample .env
# Edit .env with your configuration
```

### 3. Deploy to Azure

```bash
# Login to Azure
azd auth login

# Initialize the project
azd init

# Provision infrastructure and deploy
azd up
```

This will:
- Create all required Azure resources
- Build and push the container image
- Deploy the application to Azure Container Apps
- Configure managed identity authentication

## 🔧 Local Development

### Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The server will start on `http://localhost:3000` with the following endpoints:

- **Health Check**: `GET /health`
- **Service Info**: `GET /info`
- **MCP Endpoint**: `GET /sse` (Server-Sent Events)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `COSMOS_DB_ENDPOINT` | Cosmos DB account endpoint | Yes |
| `COSMOS_DB_DATABASE` | Database name (default: TeamManagement) | No |
| `COSMOS_DB_CONTAINER` | Container name (default: TeamMembers) | No |
| `PORT` | Server port (default: 3000) | No |
| `COSMOS_DB_KEY` | Cosmos DB key (local dev only) | Local only |

## 📡 MCP Tools

The server provides the following MCP tools for team member management:

### add_team_member
Add a new team member with their skills.

**Parameters:**
- `name` (string, required): Team member's name
- `email` (string, required): Email address
- `role` (string, required): Job role/position
- `skills` (array, required): Array of skill strings
- `experience_years` (number, optional): Years of experience

**Example:**
```json
{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "role": "Senior Developer",
  "skills": ["JavaScript", "Azure", "Node.js"],
  "experience_years": 5
}
```

### get_team_member
Retrieve a specific team member by ID.

**Parameters:**
- `id` (string, required): Unique identifier

### list_team_members
List all team members in the system.

**Parameters:** None

### update_team_member
Update an existing team member's information.

**Parameters:**
- `id` (string, required): Unique identifier
- `name` (string, optional): Updated name
- `email` (string, optional): Updated email
- `role` (string, optional): Updated role
- `skills` (array, optional): Updated skills array
- `experience_years` (number, optional): Updated experience

### delete_team_member
Remove a team member from the system.

**Parameters:**
- `id` (string, required): Unique identifier

### search_by_skill
Find team members with a specific skill.

**Parameters:**
- `skill` (string, required): Skill to search for

## 🏗️ Infrastructure

The application uses Azure Bicep templates following azd best practices:

### Resources Created

- **Resource Group**: Contains all resources
- **Container Apps Environment**: Hosting environment
- **Container Registry**: Stores application images
- **Container App**: Hosts the Node.js application
- **Cosmos DB Account**: Document database
- **Cosmos DB Database**: TeamManagement database
- **Cosmos DB Container**: TeamMembers container

### Managed Identity

The application uses system-assigned managed identity for secure access to Cosmos DB without managing credentials.

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/azure-dev.yml`) provides:

- **Automatic Deployment**: Triggers on pushes to main/master
- **Infrastructure Provisioning**: Creates/updates Azure resources
- **Application Deployment**: Builds and deploys container images
- **Environment Management**: Supports multiple environments

### Required GitHub Secrets/Variables

Configure these in your GitHub repository settings:

**Variables:**
- `AZURE_ENV_NAME`: Environment name for azd
- `AZURE_LOCATION`: Azure region (e.g., eastus2)
- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID
- `AZURE_CLIENT_ID`: Service principal client ID (for federated auth)
- `AZURE_TENANT_ID`: Azure AD tenant ID

**Secrets:**
- `AZURE_CREDENTIALS`: Service principal credentials (if not using federated auth)

## 🐳 Docker

### Building the Image

```bash
docker build -t aca-mcp-server .
```

### Running Locally

```bash
docker run -p 3000:3000 \
  -e COSMOS_DB_ENDPOINT=<your-endpoint> \
  -e COSMOS_DB_KEY=<your-key> \
  aca-mcp-server
```

## 📊 Monitoring

### Health Checks

The application includes built-in health checks:

- **Container Health**: Docker health check on `/health` endpoint
- **Application Health**: Express route returning service status

### Logging

Application logs are automatically captured by Azure Container Apps and available in:

- Azure Portal: Container Apps logs
- Azure CLI: `az containerapp logs show`
- Log Analytics: If configured

## 🔧 Troubleshooting

### Common Issues

1. **Cosmos DB Connection Issues**
   - Verify managed identity permissions
   - Check firewall settings
   - Validate endpoint configuration

2. **Container App Startup Issues**
   - Check application logs
   - Verify environment variables
   - Ensure health check endpoint responds

3. **MCP Client Connection**
   - Verify SSE endpoint accessibility
   - Check CORS configuration
   - Validate MCP protocol implementation

### Debug Commands

```bash
# Check Azure resources
azd show

# View application logs
az containerapp logs show --name <app-name> --resource-group <rg-name>

# Test health endpoint
curl https://<your-app>.azurecontainerapps.io/health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review [Azure Container Apps documentation](https://docs.microsoft.com/en-us/azure/container-apps/)
3. Check [MCP documentation](https://modelcontextprotocol.io/)
4. Open an issue in this repository

---

Built with ❤️ for the Azure community
