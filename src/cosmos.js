import { CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

class CosmosService {
  constructor() {
    this.endpoint = process.env.COSMOS_DB_ENDPOINT;
    this.databaseId = process.env.COSMOS_DB_DATABASE || 'TeamManagement';
    this.containerId = process.env.COSMOS_DB_CONTAINER || 'TeamMembers';
    
    if (!this.endpoint) {
      console.warn('COSMOS_DB_ENDPOINT not set - Cosmos DB operations will not work');
      this.client = null;
      this.database = null;
      this.container = null;
      return;
    }
    
    // Use managed identity in production, fallback to key for local development
    const credential = process.env.COSMOS_DB_KEY 
      ? process.env.COSMOS_DB_KEY 
      : new DefaultAzureCredential();

    this.client = new CosmosClient({
      endpoint: this.endpoint,
      aadCredentials: process.env.COSMOS_DB_KEY ? undefined : credential,
      key: process.env.COSMOS_DB_KEY
    });

    this.database = null;
    this.container = null;
  }

  async initialize() {
    if (!this.client) {
      console.warn('Cosmos DB client not initialized - skipping database setup');
      return;
    }

    try {
      // Create database if it doesn't exist
      const { database } = await this.client.databases.createIfNotExists({
        id: this.databaseId
      });
      this.database = database;

      // Create container if it doesn't exist
      const { container } = await this.database.containers.createIfNotExists({
        id: this.containerId,
        partitionKey: {
          paths: ['/id']
        }
      });
      this.container = container;

      console.log('Cosmos DB initialized successfully');
    } catch (error) {
      console.error('Error initializing Cosmos DB:', error);
      throw error;
    }
  }

  _ensureInitialized() {
    if (!this.container) {
      throw new Error('Cosmos DB not properly initialized. Please check configuration and connection.');
    }
  }

  async addTeamMember(teamMember) {
    this._ensureInitialized();
    try {
      const { resource } = await this.container.items.create(teamMember);
      return resource;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  async getTeamMember(id) {
    this._ensureInitialized();
    try {
      const { resource } = await this.container.item(id, id).read();
      return resource;
    } catch (error) {
      if (error.code === 404) {
        return null;
      }
      console.error('Error getting team member:', error);
      throw error;
    }
  }

  async getAllTeamMembers() {
    this._ensureInitialized();
    try {
      const { resources } = await this.container.items
        .query('SELECT * FROM c')
        .fetchAll();
      return resources;
    } catch (error) {
      console.error('Error getting all team members:', error);
      throw error;
    }
  }

  async updateTeamMember(id, updatedData) {
    this._ensureInitialized();
    try {
      const existingMember = await this.getTeamMember(id);
      if (!existingMember) {
        throw new Error('Team member not found');
      }

      const updatedMember = { ...existingMember, ...updatedData };
      const { resource } = await this.container.item(id, id).replace(updatedMember);
      return resource;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  async deleteTeamMember(id) {
    this._ensureInitialized();
    try {
      await this.container.item(id, id).delete();
      return true;
    } catch (error) {
      if (error.code === 404) {
        return false;
      }
      console.error('Error deleting team member:', error);
      throw error;
    }
  }

  async searchTeamMembersBySkill(skill) {
    this._ensureInitialized();
    try {
      const query = {
        query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(c.skills, @skill)',
        parameters: [{ name: '@skill', value: skill }]
      };
      const { resources } = await this.container.items.query(query).fetchAll();
      return resources;
    } catch (error) {
      console.error('Error searching team members by skill:', error);
      throw error;
    }
  }
}

export default CosmosService;