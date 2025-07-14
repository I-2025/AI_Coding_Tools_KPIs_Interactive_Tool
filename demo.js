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

// Sample scoring patterns for different user types
const scoringPatterns = {
    alice_dev_1234567890: {
        // Alice prefers Cursor for development
        preferences: { cursor: 0.4, vscode_copilot: 0.35, windsurf: 0.25 },
        variance: 0.8 // Less variance in scoring
    },
    bob_eng_1234567891: {
        // Bob prefers VS Code + Copilot
        preferences: { vscode_copilot: 0.45, cursor: 0.3, windsurf: 0.25 },
        variance: 1.0 // Moderate variance
    },
    carol_arch_1234567892: {
        // Carol prefers Windsurf for architecture work
        preferences: { windsurf: 0.4, vscode_copilot: 0.35, cursor: 0.25 },
        variance: 0.6 // Low variance, consistent scoring
    },
    david_lead_1234567893: {
        // David has balanced preferences
        preferences: { vscode_copilot: 0.35, cursor: 0.33, windsurf: 0.32 },
        variance: 1.2 // Higher variance, more critical
    }
};

// Generate realistic scores based on user preferences
function generateScore(userId, toolId, baseScore = 3) {
    const pattern = scoringPatterns[userId];
    if (!pattern) return Math.floor(Math.random() * 5) + 1;
    
    const preference = pattern.preferences[toolId] || 0.33;
    const variance = pattern.variance;
    
    // Calculate score based on preference and add some randomness
    let score = baseScore + (preference - 0.33) * 6; // Adjust based on preference
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
    "Very intuitive user interface"
];

// Generate sample data
function generateSampleData() {
    const sampleUserScores = {};
    const sampleTeamData = {};
    
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
            
            // Generate scores for each tool (not all tools for each KPI)
            kpiData.tools.forEach(tool => {
                if (Math.random() > 0.2) { // 80% chance of scoring each tool
                    sampleUserScores[user.id].scores[kpi.id].tools[tool.id] = 
                        generateScore(user.id, tool.id, 3);
                }
            });
            
            // Add random comment (30% chance)
            if (Math.random() > 0.7) {
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
    
    // Update UI if functions are available
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
    localStorage.removeItem('kpi_user_scores');
    localStorage.removeItem('kpi_team_data');
    localStorage.removeItem('kpi_current_user');
    
    console.log('All data cleared!');
    
    // Reload page to reset UI
    location.reload();
}

// Export functions for use in console
window.loadSampleData = loadSampleData;
window.resetData = resetData;
window.demoUsers = demoUsers;

// Auto-load sample data if URL contains ?demo=true
if (window.location.search.includes('demo=true')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(loadSampleData, 1000); // Load after app initializes
    });
}

console.log('Demo script loaded!');
console.log('Available functions:');
console.log('- loadSampleData(): Load sample data for demonstration');
console.log('- resetData(): Clear all data and reload');
console.log('- Add ?demo=true to URL to auto-load sample data'); 