import { v4 as uuidv4 } from 'uuid';

export class TeamMemberHandlers {
  constructor(cosmosService) {
    this.cosmosService = cosmosService;
  }

  async handleAddTeamMember(args) {
    try {
      if (!this.cosmosService.container) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: "Cosmos DB not configured. Please set COSMOS_DB_ENDPOINT environment variable."
              }, null, 2)
            }
          ],
          isError: true
        };
      }

      const teamMember = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        role: args.role,
        skills: args.skills || [],
        experience_years: args.experience_years || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await this.cosmosService.addTeamMember(teamMember);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "Team member added successfully",
              data: result
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  async handleGetTeamMember(args) {
    try {
      const teamMember = await this.cosmosService.getTeamMember(args.id);
      
      if (!teamMember) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                message: "Team member not found"
              }, null, 2)
            }
          ]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              data: teamMember
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  async handleListTeamMembers() {
    try {
      const teamMembers = await this.cosmosService.getAllTeamMembers();
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              count: teamMembers.length,
              data: teamMembers
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  async handleUpdateTeamMember(args) {
    try {
      const { id, ...updateData } = args;
      
      // Add updated timestamp
      updateData.updated_at = new Date().toISOString();
      
      const result = await this.cosmosService.updateTeamMember(id, updateData);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "Team member updated successfully",
              data: result
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  async handleDeleteTeamMember(args) {
    try {
      const deleted = await this.cosmosService.deleteTeamMember(args.id);
      
      if (!deleted) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                message: "Team member not found"
              }, null, 2)
            }
          ]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "Team member deleted successfully"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }

  async handleSearchBySkill(args) {
    try {
      const teamMembers = await this.cosmosService.searchTeamMembersBySkill(args.skill);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              skill: args.skill,
              count: teamMembers.length,
              data: teamMembers
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
}