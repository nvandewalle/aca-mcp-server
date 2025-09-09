# Deployment Guide

This guide walks you through deploying the Azure Container Apps MCP Server to Azure using the Azure Developer CLI.

## Prerequisites

Before deploying, ensure you have:

1. **Azure CLI** installed and configured
2. **Azure Developer CLI (azd)** installed
3. **Node.js 18+** installed
4. **Docker** installed (for local testing)
5. An **Azure subscription** with appropriate permissions

### Install Azure Developer CLI

#### Windows
```powershell
winget install Microsoft.Azd
```

#### macOS
```bash
brew install azd
```

#### Linux
```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

## Step-by-Step Deployment

### 1. Clone and Setup

```bash
git clone <repository-url>
cd aca-mcp-server
npm install
```

### 2. Login to Azure

```bash
# Login to Azure
azd auth login

# Set your subscription (if you have multiple)
az account set --subscription "your-subscription-id"
```

### 3. Initialize the Environment

```bash
# Initialize azd for this project
azd init
```

When prompted:
- **Environment name**: Choose a unique name (e.g., `aca-mcp-dev`)
- **Location**: Select your preferred Azure region (e.g., `eastus2`)

### 4. Deploy Infrastructure and Application

```bash
# Provision Azure resources and deploy application
azd up
```

This command will:
1. **Provision Infrastructure**: Create all Azure resources (Resource Group, Container Apps Environment, Container Registry, Cosmos DB, etc.)
2. **Build Application**: Create and push the Docker container image
3. **Deploy Application**: Deploy the container to Azure Container Apps
4. **Configure Security**: Set up managed identity and role assignments

The deployment typically takes 5-10 minutes.

### 5. Verify Deployment

After deployment completes, azd will display the application URL. Test the deployment:

```bash
# Get the application URL
azd show

# Test health endpoint
curl https://your-app-url.azurecontainerapps.io/health

# Test info endpoint
curl https://your-app-url.azurecontainerapps.io/info
```

## Environment Management

### Multiple Environments

You can deploy to multiple environments (dev, staging, prod):

```bash
# Create a new environment
azd env new staging

# Deploy to staging
azd up

# Switch between environments
azd env select dev
azd env select staging
```

### Environment Variables

azd automatically manages environment variables, but you can override them:

```bash
# Set environment variables
azd env set COSMOS_DB_DATABASE "TeamManagement-Staging"
azd env set COSMOS_DB_CONTAINER "TeamMembers-Staging"

# Deploy with updated variables
azd deploy
```

## Manual Azure Resource Configuration

If you prefer to deploy infrastructure manually:

### 1. Deploy Bicep Template

```bash
# Create resource group
az group create --name rg-aca-mcp-server --location eastus2

# Deploy infrastructure
az deployment group create \
  --resource-group rg-aca-mcp-server \
  --template-file infra/main.bicep \
  --parameters environmentName=aca-mcp-server location=eastus2
```

### 2. Build and Push Container

```bash
# Login to container registry
az acr login --name <your-registry-name>

# Build and push image
docker build -t <registry-name>.azurecr.io/api:latest .
docker push <registry-name>.azurecr.io/api:latest
```

### 3. Update Container App

```bash
# Update container app with new image
az containerapp update \
  --name <container-app-name> \
  --resource-group rg-aca-mcp-server \
  --image <registry-name>.azurecr.io/api:latest
```

## CI/CD Setup

### GitHub Actions Configuration

1. **Fork the repository** to your GitHub account

2. **Configure GitHub secrets**:
   ```bash
   # Configure azd for GitHub Actions
   azd pipeline config
   ```

   This will set up the required GitHub secrets:
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID`
   - `AZURE_SUBSCRIPTION_ID`
   - `AZURE_CREDENTIALS`

3. **Set GitHub variables**:
   - `AZURE_ENV_NAME`: Your environment name
   - `AZURE_LOCATION`: Your Azure region

4. **Trigger deployment**:
   - Push to `main` or `master` branch
   - Or manually trigger the workflow in GitHub Actions

### Local CI/CD Testing

Test the GitHub Actions workflow locally:

```bash
# Install act (GitHub Actions local runner)
# macOS
brew install act

# Run workflow locally
act -j build
```

## Monitoring and Troubleshooting

### View Application Logs

```bash
# View recent logs
az containerapp logs show \
  --name <container-app-name> \
  --resource-group <resource-group-name> \
  --follow

# View logs from specific time period
az containerapp logs show \
  --name <container-app-name> \
  --resource-group <resource-group-name> \
  --since "2024-09-08T10:00:00Z"
```

### Check Resource Status

```bash
# Check container app status
az containerapp show \
  --name <container-app-name> \
  --resource-group <resource-group-name> \
  --query "properties.provisioningState"

# Check Cosmos DB status
az cosmosdb show \
  --name <cosmosdb-name> \
  --resource-group <resource-group-name> \
  --query "provisioningState"
```

### Common Issues and Solutions

#### 1. Container App Startup Issues

**Issue**: Container app fails to start or health checks fail.

**Solution**:
```bash
# Check container app logs
az containerapp logs show --name <app-name> --resource-group <rg-name>

# Check environment variables
az containerapp show --name <app-name> --resource-group <rg-name> \
  --query "properties.template.containers[0].env"

# Restart the container app
az containerapp revision restart --name <app-name> --resource-group <rg-name>
```

#### 2. Cosmos DB Connection Issues

**Issue**: Application can't connect to Cosmos DB.

**Solution**:
```bash
# Check managed identity assignment
az cosmosdb sql role assignment list \
  --account-name <cosmosdb-name> \
  --resource-group <rg-name>

# Verify firewall settings
az cosmosdb show --name <cosmosdb-name> --resource-group <rg-name> \
  --query "ipRules"

# Test connection from Container App
az containerapp exec \
  --name <app-name> \
  --resource-group <rg-name> \
  --command "curl -v $COSMOS_DB_ENDPOINT"
```

#### 3. Image Pull Issues

**Issue**: Container registry authentication failures.

**Solution**:
```bash
# Check registry credentials
az acr credential show --name <registry-name>

# Update container app with registry credentials
az containerapp update \
  --name <app-name> \
  --resource-group <rg-name> \
  --set-env-vars "REGISTRY_PASSWORD=<password>"
```

## Scaling and Performance

### Configure Scaling

```bash
# Update scaling configuration
az containerapp update \
  --name <app-name> \
  --resource-group <rg-name> \
  --min-replicas 2 \
  --max-replicas 20
```

### Monitor Performance

```bash
# View metrics
az monitor metrics list \
  --resource <container-app-resource-id> \
  --metric "CpuPercentage,MemoryPercentage" \
  --start-time "2024-09-08T00:00:00Z" \
  --end-time "2024-09-08T23:59:59Z"
```

## Cleanup

### Remove All Resources

```bash
# Delete the entire environment
azd down

# Or delete resource group manually
az group delete --name <resource-group-name> --yes --no-wait
```

### Remove Specific Resources

```bash
# Delete container app only
az containerapp delete --name <app-name> --resource-group <rg-name>

# Delete Cosmos DB only
az cosmosdb delete --name <cosmosdb-name> --resource-group <rg-name>
```

## Security Considerations

### Network Security

- Container Apps are deployed with HTTPS by default
- Consider implementing private endpoints for Cosmos DB
- Review ingress settings for external access

### Identity and Access

- Managed identity is configured for Cosmos DB access
- Review role assignments and permissions
- Consider implementing additional authentication for the API

### Data Protection

- Cosmos DB encryption is enabled by default
- Configure backup policies
- Implement data retention policies

## Cost Optimization

### Scaling Configuration

- Set appropriate min/max replicas based on usage
- Use consumption-based pricing for Container Apps
- Monitor Cosmos DB RU consumption

### Resource Sizing

- Start with minimal CPU/memory allocations
- Monitor and adjust based on actual usage
- Consider reserved capacity for predictable workloads