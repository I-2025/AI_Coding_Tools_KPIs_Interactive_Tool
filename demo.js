// Demo script to add sample data to the KPI Scorecard Application
// This file can be loaded to demonstrate the application with sample data

// Sample team members for demonstration
const demoUsers = [
    {
        id: 'alice_dev_1234567890',
        name: 'Alice Developer',
        loginTime: '2024-01-15T10:30:00.000Z'
    },
    {
        id: 'bob_eng_1234567891',
        name: 'Bob Engineer',
        loginTime: '2024-01-15T11:15:00.000Z'
    },
    {
        id: 'carol_arch_1234567892',
        name: 'Carol Architect',
        loginTime: '2024-01-15T09:45:00.000Z'
    },
    {
        id: 'david_lead_1234567893',
        name: 'David Lead',
        loginTime: '2024-01-15T14:20:00.000Z'
    }
];

// Sample custom tools to demonstrate the new functionality
const sampleCustomTools = [
    {
        id: 'claude_dev_1234567894',
        name: 'Claude Dev',
        description: 'AI assistant for development tasks',
        color: '#FF8C00',
        isDefault: false,
        dateAdded: '2024-01-15T12:00:00.000Z'
    },
    {
        id: 'tabnine_1234567895',
        name: 'Tabnine',
        description: 'AI code completion tool',
        color: '#4A90E2',
        isDefault: false,
        dateAdded: '2024-01-15T13:00:00.000Z'
    }
];

// Sample scoring patterns for different user types (updated for dynamic tools)
const scoringPatterns = {
    alice_dev_1234567890: {
        // Alice prefers Cursor and Claude Dev
        preferences: { 
            cursor: 0.3, 
            vscode_copilot: 0.2, 
            windsurf: 0.2, 
            claude_dev_1234567894: 0.25,
            tabnine_1234567895: 0.05
        },
        variance: 0.8 // Less variance in scoring
    },
    bob_eng_1234567891: {
        // Bob prefers VS Code + Copilot and Tabnine
        preferences: { 
            vscode_copilot: 0.35, 
            cursor: 0.2, 
            windsurf: 0.15, 
            claude_dev_1234567894: 0.1,
            tabnine_1234567895: 0.2
        },
        variance: 1.0 // Moderate variance
    },
    carol_arch_1234567892: {
        // Carol prefers Windsurf and Claude Dev for architecture work
        preferences: { 
            windsurf: 0.3, 
            vscode_copilot: 0.2, 
            cursor: 0.15, 
            claude_dev_1234567894: 0.3,
            tabnine_1234567895: 0.05
        },
        variance: 0.6 // Low variance, consistent scoring
    },
    david_lead_1234567893: {
        // David has balanced preferences but slightly favors traditional tools
        preferences: { 
            vscode_copilot: 0.3, 
            cursor: 0.25, 
            windsurf: 0.25, 
            claude_dev_1234567894: 0.15,
            tabnine_1234567895: 0.05
        },
        variance: 1.2 // Higher variance, more critical
    }
};

// Generate realistic scores based on user preferences
function generateScore(userId, toolId, baseScore = 3) {
    const pattern = scoringPatterns[userId];
    if (!pattern) return Math.floor(Math.random() * 5) + 1;
    
    const preference = pattern.preferences[toolId] || 0.2; // Default preference
    const variance = pattern.variance;
    
    // Calculate score based on preference and add some randomness
    let score = baseScore + (preference - 0.2) * 10; // Adjust based on preference
    score += (Math.random() - 0.5) * variance; // Add variance
    
    // Ensure score is within 1-5 range
    return Math.max(1, Math.min(5, Math.round(score)));
}

// Generate sample comments
const sampleComments = [
    "Great for complex refactoring tasks",
    "Excellent code completion accuracy",
    "Could improve performance on large files",
    "Very helpful for learning new frameworks",
    "Good integration with existing workflow",
    "Sometimes suggests overly complex solutions",
    "Perfect for rapid prototyping",
    "Needs better error handling suggestions",
    "Impressive context awareness",
    "Could use more customization options",
    "Excellent documentation generation",
    "Works well with team collaboration",
    "Great for debugging assistance",
    "Could improve multi-language support",
    "Very intuitive user interface",
    "Strong architectural guidance",
    "Excellent for code reviews",
    "Good at suggesting best practices",
    "Helpful for learning new technologies",
    "Could be more responsive"
];

// Add sample custom tools
function addSampleCustomTools() {
    // Ensure we have the default tools
    const defaultTools = [
        {
            id: 'vscode_copilot',
            name: 'VS Code + Copilot',
            description: 'Visual Studio Code with GitHub Copilot integration',
            color: '#007ACC',
            isDefault: true
        },
        {
            id: 'cursor',
            name: 'Cursor',
            description: 'AI-powered code editor',
            color: '#000000',
            isDefault: true
        },
        {
            id: 'windsurf',
            name: 'Windsurf',
            description: 'AI-enhanced development environment',
            color: '#FF6B6B',
            isDefault: true
        }
    ];
    
    // Merge with existing tools, ensuring defaults are preserved
    const existingCustomTools = kpiData.tools.filter(tool => !tool.isDefault);
    const newCustomTools = sampleCustomTools.filter(tool => 
        !existingCustomTools.some(existing => existing.id === tool.id)
    );
    
    kpiData.tools = [...defaultTools, ...existingCustomTools, ...newCustomTools];
    
    // Save to localStorage
    const customTools = kpiData.tools.filter(tool => !tool.isDefault);
    localStorage.setItem('kpi_custom_tools', JSON.stringify(customTools));
    
    console.log('Sample custom tools added:', newCustomTools.map(t => t.name).join(', '));
}

// Generate sample data
function generateSampleData() {
    const sampleUserScores = {};
    const sampleTeamData = {};
    
    // Add sample custom tools first
    addSampleCustomTools();
    
    // Generate data for each user
    demoUsers.forEach(user => {
        // Initialize user data
        sampleUserScores[user.id] = {
            user: user,
            scores: {},
            lastUpdated: new Date().toISOString()
        };
        
        sampleTeamData[user.id] = {
            ...user,
            lastActivity: new Date().toISOString(),
            totalScores: 0
        };
        
        // Generate scores for random KPIs (about 60-80% completion)
        const completionRate = 0.6 + Math.random() * 0.2;
        const totalKPIs = getTotalKPICount();
        const kpisToScore = Math.floor(totalKPIs * completionRate);
        
        // Get all KPIs and shuffle them
        const allKPIs = getAllKPIs();
        const shuffledKPIs = allKPIs.sort(() => Math.random() - 0.5);
        const selectedKPIs = shuffledKPIs.slice(0, kpisToScore);
        
        selectedKPIs.forEach(kpi => {
            sampleUserScores[user.id].scores[kpi.id] = {
                kpiId: kpi.id,
                categoryId: kpi.categoryId,
                tools: {},
                comment: '',
                lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            };
            
            // Generate scores for each tool (including custom tools)
            kpiData.tools.forEach(tool => {
                if (Math.random() > 0.15) { // 85% chance of scoring each tool
                    sampleUserScores[user.id].scores[kpi.id].tools[tool.id] = 
                        generateScore(user.id, tool.id, 3);
                }
            });
            
            // Add random comment (40% chance)
            if (Math.random() > 0.6) {
                sampleUserScores[user.id].scores[kpi.id].comment = 
                    sampleComments[Math.floor(Math.random() * sampleComments.length)];
            }
        });
        
        // Update total scores
        sampleTeamData[user.id].totalScores = Object.keys(sampleUserScores[user.id].scores).length;
    });
    
    return { sampleUserScores, sampleTeamData };
}

// Load sample data into the application
function loadSampleData() {
    const { sampleUserScores, sampleTeamData } = generateSampleData();
    
    // Clear existing data
    userScores = {};
    teamData = {};
    
    // Load sample data
    userScores = sampleUserScores;
    teamData = sampleTeamData;
    
    // Save to localStorage
    localStorage.setItem('kpi_user_scores', JSON.stringify(userScores));
    localStorage.setItem('kpi_team_data', JSON.stringify(teamData));
    
    console.log('Sample data loaded successfully!');
    console.log(`Generated data for ${demoUsers.length} users`);
    console.log('Team members:', demoUsers.map(u => u.name).join(', '));
    console.log('Custom tools added:', sampleCustomTools.map(t => t.name).join(', '));
    
    // Update UI if functions are available
    if (typeof updateToolsList === 'function') {
        updateToolsList();
    }
    if (typeof populateScorecardTab === 'function') {
        populateScorecardTab();
    }
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
    if (typeof updateTeamAnalytics === 'function') {
        updateTeamAnalytics();
    }
    if (typeof loadUserScores === 'function') {
        loadUserScores();
    }
    
    return { userScores, teamData };
}

// Reset data function
function resetData() {
    userScores = {};
    teamData = {};
    
    // Reset tools to defaults only - ensure we keep the default tools
    kpiData.tools = kpiData.tools.filter(tool => tool.isDefault);
    
    // Clear localStorage
    localStorage.removeItem('kpi_user_scores');
    localStorage.removeItem('kpi_team_data');
    localStorage.removeItem('kpi_current_user');
    localStorage.removeItem('kpi_custom_tools');
    
    console.log('All data cleared!');
    console.log('Tools reset to defaults:', kpiData.tools.map(t => t.name).join(', '));
    
    // Update UI instead of reloading page
    if (typeof updateToolsList === 'function') {
        updateToolsList();
    }
    if (typeof populateScorecardTab === 'function') {
        populateScorecardTab();
    }
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
    if (typeof updateTeamAnalytics === 'function') {
        updateTeamAnalytics();
    }
    
    // Clear current user
    currentUser = null;
    document.getElementById('username').value = '';
    document.getElementById('currentUser').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'inline-block';
    
    console.log('Application reset to initial state');
}

// Add a function to just add custom tools without full demo data
function addCustomToolsDemo() {
    addSampleCustomTools();
    
    // Update UI
    if (typeof updateToolsList === 'function') {
        updateToolsList();
    }
    if (typeof populateScorecardTab === 'function') {
        populateScorecardTab();
    }
    
    console.log('Custom tools demo added!');
    console.log('You can now test the tool management features.');
}

// Export functions for use in console
window.loadSampleData = loadSampleData;
window.resetData = resetData;
window.addCustomToolsDemo = addCustomToolsDemo;
window.demoUsers = demoUsers;
window.sampleCustomTools = sampleCustomTools;

// Auto-load sample data if URL contains ?demo=true
if (window.location.search.includes('demo=true')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(loadSampleData, 1000); // Load after app initializes
    });
}

console.log('Demo script loaded!');
console.log('Available functions:');
console.log('- loadSampleData(): Load sample data with custom tools for demonstration');
console.log('- addCustomToolsDemo(): Add custom tools only (no sample scores)');
console.log('- resetData(): Clear all data and reset to defaults');
console.log('- Add ?demo=true to URL to auto-load sample data');
console.log('- Custom tools in demo:', sampleCustomTools.map(t => t.name).join(', ')); 