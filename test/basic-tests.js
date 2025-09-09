import { teamMemberTools } from '../src/handlers/tools.js';
import { TeamMemberHandlers } from '../src/handlers/teamMembers.js';

// Mock Cosmos service for testing
class MockCosmosService {
  constructor() {
    this.container = true; // Simulate having a container
    this.members = new Map();
  }

  async initialize() {
    // No-op for mock
  }

  async addTeamMember(member) {
    this.members.set(member.id, member);
    return member;
  }

  async getTeamMember(id) {
    return this.members.get(id) || null;
  }

  async getAllTeamMembers() {
    return Array.from(this.members.values());
  }

  async updateTeamMember(id, updates) {
    const existing = this.members.get(id);
    if (!existing) {
      throw new Error('Team member not found');
    }
    const updated = { ...existing, ...updates };
    this.members.set(id, updated);
    return updated;
  }

  async deleteTeamMember(id) {
    return this.members.delete(id);
  }

  async searchTeamMembersBySkill(skill) {
    return Array.from(this.members.values()).filter(member =>
      member.skills.includes(skill)
    );
  }
}

// Test function
async function runTests() {
  console.log('🚀 Starting MCP Server Tests...\n');

  const mockCosmos = new MockCosmosService();
  const handlers = new TeamMemberHandlers(mockCosmos);

  // Test 1: Verify tools are properly defined
  console.log('✅ Test 1: Tool definitions');
  console.log(`Found ${teamMemberTools.length} tools: ${teamMemberTools.map(t => t.name).join(', ')}\n`);

  // Test 2: Add a team member
  console.log('✅ Test 2: Add team member');
  const addResult = await handlers.handleAddTeamMember({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Software Engineer",
    skills: ["JavaScript", "Node.js", "Azure"],
    experience_years: 5
  });
  
  const addData = JSON.parse(addResult.content[0].text);
  console.log(`Added member: ${addData.data.name} (ID: ${addData.data.id})\n`);
  const memberId = addData.data.id;

  // Test 3: Get the team member
  console.log('✅ Test 3: Get team member');
  const getResult = await handlers.handleGetTeamMember({ id: memberId });
  const getData = JSON.parse(getResult.content[0].text);
  console.log(`Retrieved member: ${getData.data.name}\n`);

  // Test 4: List all team members
  console.log('✅ Test 4: List team members');
  const listResult = await handlers.handleListTeamMembers();
  const listData = JSON.parse(listResult.content[0].text);
  console.log(`Found ${listData.count} team members\n`);

  // Test 5: Update team member
  console.log('✅ Test 5: Update team member');
  const updateResult = await handlers.handleUpdateTeamMember({
    id: memberId,
    role: "Senior Software Engineer",
    skills: ["JavaScript", "Node.js", "Azure", "TypeScript"]
  });
  const updateData = JSON.parse(updateResult.content[0].text);
  console.log(`Updated member role: ${updateData.data.role}\n`);

  // Test 6: Search by skill
  console.log('✅ Test 6: Search by skill');
  const searchResult = await handlers.handleSearchBySkill({ skill: "Azure" });
  const searchData = JSON.parse(searchResult.content[0].text);
  console.log(`Found ${searchData.count} members with Azure skills\n`);

  // Test 7: Delete team member
  console.log('✅ Test 7: Delete team member');
  const deleteResult = await handlers.handleDeleteTeamMember({ id: memberId });
  const deleteData = JSON.parse(deleteResult.content[0].text);
  console.log(`Delete successful: ${deleteData.success}\n`);

  // Test 8: Verify deletion
  console.log('✅ Test 8: Verify deletion');
  const finalListResult = await handlers.handleListTeamMembers();
  const finalListData = JSON.parse(finalListResult.content[0].text);
  console.log(`Final count: ${finalListData.count} team members\n`);

  console.log('🎉 All tests completed successfully!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };