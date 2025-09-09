export const teamMemberTools = [
  {
    name: "add_team_member",
    description: "Add a new team member with their skills",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the team member"
        },
        email: {
          type: "string",
          description: "The email address of the team member"
        },
        role: {
          type: "string",
          description: "The role/position of the team member"
        },
        skills: {
          type: "array",
          items: {
            type: "string"
          },
          description: "List of skills possessed by the team member"
        },
        experience_years: {
          type: "number",
          description: "Years of experience (optional)",
          minimum: 0
        }
      },
      required: ["name", "email", "role", "skills"]
    }
  },
  {
    name: "get_team_member",
    description: "Get a team member by their ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the team member"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "list_team_members",
    description: "List all team members",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "update_team_member",
    description: "Update an existing team member's information and skills",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the team member"
        },
        name: {
          type: "string",
          description: "The updated name of the team member"
        },
        email: {
          type: "string",
          description: "The updated email address"
        },
        role: {
          type: "string",
          description: "The updated role/position"
        },
        skills: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Updated list of skills"
        },
        experience_years: {
          type: "number",
          description: "Updated years of experience",
          minimum: 0
        }
      },
      required: ["id"]
    }
  },
  {
    name: "delete_team_member",
    description: "Delete a team member",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the team member to delete"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "search_by_skill",
    description: "Search team members by a specific skill",
    inputSchema: {
      type: "object",
      properties: {
        skill: {
          type: "string",
          description: "The skill to search for"
        }
      },
      required: ["skill"]
    }
  }
];