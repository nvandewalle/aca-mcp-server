# Azure Container Apps MCP Server - API Examples

This document provides practical examples of how to use the MCP server API for team member management.

## MCP Tools Usage

### 1. Adding a Team Member

**Tool**: `add_team_member`

```json
{
  "name": "add_team_member",
  "arguments": {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@company.com",
    "role": "Senior Full Stack Developer",
    "skills": ["JavaScript", "React", "Node.js", "Azure", "Docker", "Kubernetes"],
    "experience_years": 8
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Team member added successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Sarah Johnson",
    "email": "sarah.johnson@company.com",
    "role": "Senior Full Stack Developer",
    "skills": ["JavaScript", "React", "Node.js", "Azure", "Docker", "Kubernetes"],
    "experience_years": 8,
    "created_at": "2024-09-08T15:30:00.000Z",
    "updated_at": "2024-09-08T15:30:00.000Z"
  }
}
```

### 2. Getting a Specific Team Member

**Tool**: `get_team_member`

```json
{
  "name": "get_team_member",
  "arguments": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Sarah Johnson",
    "email": "sarah.johnson@company.com",
    "role": "Senior Full Stack Developer",
    "skills": ["JavaScript", "React", "Node.js", "Azure", "Docker", "Kubernetes"],
    "experience_years": 8,
    "created_at": "2024-09-08T15:30:00.000Z",
    "updated_at": "2024-09-08T15:30:00.000Z"
  }
}
```

### 3. Listing All Team Members

**Tool**: `list_team_members`

```json
{
  "name": "list_team_members",
  "arguments": {}
}
```

**Response**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Sarah Johnson",
      "email": "sarah.johnson@company.com",
      "role": "Senior Full Stack Developer",
      "skills": ["JavaScript", "React", "Node.js", "Azure", "Docker", "Kubernetes"],
      "experience_years": 8,
      "created_at": "2024-09-08T15:30:00.000Z",
      "updated_at": "2024-09-08T15:30:00.000Z"
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
      "name": "Mike Chen",
      "email": "mike.chen@company.com",
      "role": "DevOps Engineer",
      "skills": ["Azure", "Terraform", "Kubernetes", "Python", "Linux"],
      "experience_years": 6,
      "created_at": "2024-09-08T14:20:00.000Z",
      "updated_at": "2024-09-08T14:20:00.000Z"
    },
    {
      "id": "c3d4e5f6-g7h8-9012-cdef-345678901234",
      "name": "Emma Rodriguez",
      "email": "emma.rodriguez@company.com",
      "role": "UI/UX Designer",
      "skills": ["Figma", "Adobe Creative Suite", "HTML", "CSS", "JavaScript"],
      "experience_years": 4,
      "created_at": "2024-09-08T13:15:00.000Z",
      "updated_at": "2024-09-08T13:15:00.000Z"
    }
  ]
}
```

### 4. Updating a Team Member

**Tool**: `update_team_member`

```json
{
  "name": "update_team_member",
  "arguments": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "role": "Lead Full Stack Developer",
    "skills": ["JavaScript", "React", "Node.js", "Azure", "Docker", "Kubernetes", "TypeScript", "GraphQL"],
    "experience_years": 9
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Team member updated successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Sarah Johnson",
    "email": "sarah.johnson@company.com",
    "role": "Lead Full Stack Developer",
    "skills": ["JavaScript", "React", "Node.js", "Azure", "Docker", "Kubernetes", "TypeScript", "GraphQL"],
    "experience_years": 9,
    "created_at": "2024-09-08T15:30:00.000Z",
    "updated_at": "2024-09-08T16:45:00.000Z"
  }
}
```

### 5. Searching by Skill

**Tool**: `search_by_skill`

```json
{
  "name": "search_by_skill",
  "arguments": {
    "skill": "Azure"
  }
}
```

**Response**:
```json
{
  "success": true,
  "skill": "Azure",
  "count": 2,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Sarah Johnson",
      "email": "sarah.johnson@company.com",
      "role": "Lead Full Stack Developer",
      "skills": ["JavaScript", "React", "Node.js", "Azure", "Docker", "Kubernetes", "TypeScript", "GraphQL"],
      "experience_years": 9,
      "created_at": "2024-09-08T15:30:00.000Z",
      "updated_at": "2024-09-08T16:45:00.000Z"
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
      "name": "Mike Chen",
      "email": "mike.chen@company.com",
      "role": "DevOps Engineer",
      "skills": ["Azure", "Terraform", "Kubernetes", "Python", "Linux"],
      "experience_years": 6,
      "created_at": "2024-09-08T14:20:00.000Z",
      "updated_at": "2024-09-08T14:20:00.000Z"
    }
  ]
}
```

### 6. Deleting a Team Member

**Tool**: `delete_team_member`

```json
{
  "name": "delete_team_member",
  "arguments": {
    "id": "c3d4e5f6-g7h8-9012-cdef-345678901234"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Team member deleted successfully"
}
```

## Error Handling Examples

### Team Member Not Found

```json
{
  "success": false,
  "message": "Team member not found"
}
```

### Database Connection Error

```json
{
  "success": false,
  "error": "Cosmos DB not configured. Please set COSMOS_DB_ENDPOINT environment variable."
}
```

### Invalid Input

```json
{
  "success": false,
  "error": "Error executing add_team_member: Missing required field 'email'"
}
```

## HTTP Endpoints

### Health Check

```bash
curl -X GET https://your-app.azurecontainerapps.io/health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-09-08T16:00:00.000Z",
  "service": "aca-mcp-server"
}
```

### Service Information

```bash
curl -X GET https://your-app.azurecontainerapps.io/info
```

**Response**:
```json
{
  "name": "Azure Container Apps MCP Server",
  "version": "1.0.0",
  "description": "MCP server for team member and skills management",
  "capabilities": [
    "add_team_member",
    "get_team_member", 
    "list_team_members",
    "update_team_member",
    "delete_team_member",
    "search_by_skill"
  ]
}
```

## MCP Client Integration

### Using with Claude or other MCP clients

The MCP server uses Server-Sent Events (SSE) for real-time communication. Connect your MCP client to:

```
https://your-app.azurecontainerapps.io/sse
```

### Example MCP Client Configuration

```json
{
  "mcpServers": {
    "team-management": {
      "command": "node",
      "args": ["path/to/mcp-client.js"],
      "env": {
        "MCP_SERVER_URL": "https://your-app.azurecontainerapps.io/sse"
      }
    }
  }
}
```

## Data Schema

### Team Member Object

```typescript
interface TeamMember {
  id: string;                    // UUID v4
  name: string;                  // Full name
  email: string;                 // Email address (unique)
  role: string;                  // Job title/role
  skills: string[];              // Array of skills
  experience_years?: number;     // Years of experience (optional)
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}
```

### Skill Requirements

- Skills are stored as an array of strings
- Case-sensitive matching for search operations
- No maximum limit on number of skills
- Skills should be descriptive (e.g., "JavaScript", "Azure Functions", "Kubernetes")

## Production Considerations

1. **Rate Limiting**: Consider implementing rate limiting for production use
2. **Validation**: Add comprehensive input validation
3. **Monitoring**: Implement application insights and logging
4. **Backup**: Configure Cosmos DB backup policies
5. **Security**: Review network security and access controls