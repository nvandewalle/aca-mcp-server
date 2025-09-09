#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

import CosmosService from './cosmos.js';
import { teamMemberTools } from './handlers/tools.js';
import { TeamMemberHandlers } from './handlers/teamMembers.js';

class TeamMemberMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'aca-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.cosmosService = new CosmosService();
    this.handlers = new TeamMemberHandlers(this.cosmosService);
    
    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: teamMemberTools
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'add_team_member':
            return await this.handlers.handleAddTeamMember(args);
          
          case 'get_team_member':
            return await this.handlers.handleGetTeamMember(args);
          
          case 'list_team_members':
            return await this.handlers.handleListTeamMembers();
          
          case 'update_team_member':
            return await this.handlers.handleUpdateTeamMember(args);
          
          case 'delete_team_member':
            return await this.handlers.handleDeleteTeamMember(args);
          
          case 'search_by_skill':
            return await this.handlers.handleSearchBySkill(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: `Error executing ${name}: ${error.message}`
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
  }

  async start() {
    try {
      // Initialize Cosmos DB connection
      await this.cosmosService.initialize();
      console.log('Team Member MCP Server initialized successfully');

      // Create Express app for health checks and MCP endpoint
      const app = express();
      app.use(cors());
      app.use(express.json());

      // Health check endpoint
      app.get('/health', (req, res) => {
        res.status(200).json({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          service: 'aca-mcp-server'
        });
      });

      // Info endpoint
      app.get('/info', (req, res) => {
        res.status(200).json({
          name: 'Azure Container Apps MCP Server',
          version: '1.0.0',
          description: 'MCP server for team member and skills management',
          capabilities: ['add_team_member', 'get_team_member', 'list_team_members', 'update_team_member', 'delete_team_member', 'search_by_skill']
        });
      });

      // Create Streamable HTTP transport
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID()
      });

      // Connect server to transport
      await this.server.connect(transport);

      // MCP Streamable HTTP endpoint
      app.post('/mcp', async (req, res) => {
        try {
          await transport.handleRequest(req, res);
        } catch (error) {
          console.error('MCP request error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });

      // MCP SSE endpoint for streaming
      app.get('/mcp', async (req, res) => {
        try {
          await transport.handleRequest(req, res);
        } catch (error) {
          console.error('MCP SSE error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });

      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Team Member MCP Server running on port ${port}`);
        console.log(`Health check available at: http://localhost:${port}/health`);
        console.log(`MCP endpoint available at: http://localhost:${port}/mcp`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  process.exit(0);
});

// Start the server
const server = new TeamMemberMCPServer();
server.start().catch(console.error);