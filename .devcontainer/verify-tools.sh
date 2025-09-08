#!/bin/bash

# DevContainer Verification Script
# This script verifies that all required tools are installed and accessible

echo "🔍 Verifying DevContainer Tools Installation..."
echo "================================================"

# Function to check if a command exists and print version
check_tool() {
    local tool_name=$1
    local version_cmd=$2
    local description=$3
    
    if command -v ${tool_name} &> /dev/null; then
        echo "✅ ${description}"
        echo "   Version: $(${version_cmd} 2>/dev/null || echo 'Version check failed')"
    else
        echo "❌ ${description} - NOT FOUND"
    fi
    echo ""
}

# Check Node.js
check_tool "node" "node --version" "Node.js"

# Check npm
check_tool "npm" "npm --version" "npm (Node Package Manager)"

# Check Python
check_tool "python" "python --version" "Python"

# Check pip
check_tool "pip" "pip --version" "pip (Python Package Manager)"

# Check Git
check_tool "git" "git --version" "Git"

# Check GitHub CLI
check_tool "gh" "gh --version" "GitHub CLI"

# Check Docker
check_tool "docker" "docker --version" "Docker"

# Check Azure CLI
check_tool "az" "az --version | head -1" "Azure CLI"

# Check Azure Developer CLI (azd)
check_tool "azd" "azd version" "Azure Developer CLI (azd)"

echo "================================================"
echo "🎉 DevContainer verification complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Run 'az login' to authenticate with Azure"
echo "   2. Run 'azd auth login' to authenticate Azure Developer CLI"
echo "   3. Start developing your MCP server!"