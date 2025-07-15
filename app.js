// Application State
let currentUser = null;
let userScores = {};
let teamData = {};
let charts = {};

// Local Storage Keys
const STORAGE_KEYS = {
    USER_SCORES: 'kpi_user_scores',
    TEAM_DATA: 'kpi_team_data',
    CURRENT_USER: 'kpi_current_user'
};

// Tool Management Functions (moved up to be available early)
function loadCustomTools() {
    const customTools = localStorage.getItem('kpi_custom_tools');
    if (customTools) {
        try {
            const parsed = JSON.parse(customTools);
            // Merge custom tools with default tools, ensuring defaults are never removed
            const defaultTools = kpiData.tools.filter(tool => tool.isDefault);
            const customToolsArray = parsed.filter(tool => !tool.isDefault);
            kpiData.tools = [...defaultTools, ...customToolsArray];
        } catch (e) {
            console.error('Error loading custom tools:', e);
        }
    }
}

function saveCustomTools() {
    const customTools = kpiData.tools.filter(tool => !tool.isDefault);
    localStorage.setItem('kpi_custom_tools', JSON.stringify(customTools));
}

function updateToolsList() {
    const toolsList = document.getElementById('toolsList');
    if (!toolsList) return; // Guard against missing element
    
    toolsList.innerHTML = '';
    
    kpiData.tools.forEach(tool => {
        const toolItem = document.createElement('div');
        toolItem.className = `tool-item ${tool.isDefault ? 'default' : 'custom'}`;
        toolItem.style.borderLeftColor = tool.color;
        
        toolItem.innerHTML = `
            <div class="tool-color" style="background-color: ${tool.color}"></div>
            <div>
                <h4>${tool.name}</h4>
                <p>${tool.description}</p>
                <span class="tool-badge">${tool.isDefault ? 'Default' : 'Custom'}</span>
            </div>
        `;
        
        toolsList.appendChild(toolItem);
    });
}

function showAddToolModal() {
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.style.display = 'flex';
        const toolName = document.getElementById('toolName');
        if (toolName) toolName.focus();
    }
}

function hideAddToolModal() {
    const modal = document.getElementById('addToolModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('addToolForm');
        if (form) form.reset();
    }
}

function showManageToolsModal() {
    const modal = document.getElementById('manageToolsModal');
    if (modal) {
        modal.style.display = 'flex';
        updateToolsManagementList();
    }
}

function hideManageToolsModal() {
    const modal = document.getElementById('manageToolsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateToolsManagementList() {
    const toolsList = document.getElementById('toolsManagementList');
    if (!toolsList) return;
    
    toolsList.innerHTML = '';
    
    kpiData.tools.forEach(tool => {
        const toolItem = document.createElement('div');
        toolItem.className = 'tool-management-item';
        
        toolItem.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div class="tool-color" style="background-color: ${tool.color}"></div>
                <div class="tool-info">
                    <h4>${tool.name} ${tool.isDefault ? '(Default)' : ''}</h4>
                    <p>${tool.description}</p>
                </div>
            </div>
            <div class="tool-actions-mini">
                <button class="remove-tool-btn" onclick="removeToolConfirm('${tool.id}')" 
                        ${tool.isDefault ? 'disabled' : ''}>
                    ${tool.isDefault ? 'Built-in' : 'Remove'}
                </button>
            </div>
        `;
        
        toolsList.appendChild(toolItem);
    });
}

function removeToolConfirm(toolId) {
    const tool = getToolById(toolId);
    if (!tool) return;
    
    if (tool.isDefault) {
        showAlert('Cannot remove default tools', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to remove "${tool.name}"? This will delete all scores for this tool.`)) {
        try {
            removeTool(toolId);
            showAlert('Tool removed successfully!', 'success');
            updateToolsManagementList();
            updateToolsList();
            populateScorecardTab();
            updateDashboard();
            updateTeamAnalytics();
        } catch (error) {
            showAlert('Error removing tool: ' + error.message, 'error');
        }
    }
}

function addToolLocal(toolData) {
    const existingTool = kpiData.tools.find(t => t.name.toLowerCase() === toolData.name.toLowerCase());
    if (existingTool) {
        throw new Error('A tool with this name already exists.');
    }

    const newTool = {
        id: generateToolId(toolData.name),
        name: toolData.name,
        description: toolData.description,
        color: toolData.color,
        isDefault: false
    };
    
    kpiData.tools.push(newTool);
    saveCustomTools();
    return newTool;
}

function generateToolId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now();
}

function removeTool(toolId) {
    const tool = kpiData.tools.find(t => t.id === toolId);
    if (!tool) {
        throw new Error('Tool not found');
    }
    
    if (tool.isDefault) {
        throw new Error('Cannot remove default tools');
    }
    
    // Remove from tools array
    kpiData.tools = kpiData.tools.filter(t => t.id !== toolId);
    
    // Remove from all user scores
    Object.keys(userScores).forEach(userId => {
        const userScore = userScores[userId];
        Object.keys(userScore.scores).forEach(kpiId => {
            const scoreData = userScore.scores[kpiId];
            if (scoreData.tools[toolId]) {
                delete scoreData.tools[toolId];
            }
        });
    });
    
    saveCustomTools();
    saveToStorage();
    return true;
}

function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert after the tool management section
    const toolManagement = document.querySelector('.tool-management');
    if (toolManagement && toolManagement.parentNode) {
        toolManagement.parentNode.insertBefore(alert, toolManagement.nextSibling);
    } else {
        // Fallback: insert at the beginning of the content
        const content = document.querySelector('.content');
        if (content) {
            content.insertBefore(alert, content.firstChild);
        }
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Make functions globally available
window.showAddToolModal = showAddToolModal;
window.hideAddToolModal = hideAddToolModal;
window.showManageToolsModal = showManageToolsModal;
window.hideManageToolsModal = hideManageToolsModal;
window.removeToolConfirm = removeToolConfirm;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadFromStorage();
    loadCustomTools(); // Load custom tools from localStorage
    setupEventListeners();
    populateDocumentationTab();
    updateToolsList();
    populateScorecardTab();
    updateDashboard();
    updateTeamAnalytics();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserInterface();
        // Load user scores after setting current user
        loadUserScores();
    }
}

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(tabId);
        });
    });

    // User login on Enter key
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginUser();
        }
    });

    // Filter functionality
    document.getElementById('categoryFilter').addEventListener('change', filterDocumentation);
    document.getElementById('searchFilter').addEventListener('input', filterDocumentation);
    
    // Add tool form submission
    const addToolForm = document.getElementById('addToolForm');
    if (addToolForm) {
        addToolForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const toolData = {
                name: formData.get('toolName').trim(),
                description: formData.get('toolDescription').trim(),
                color: formData.get('toolColor')
            };
            
            try {
                const newTool = addToolLocal(toolData);
                showAlert(`Tool "${newTool.name}" added successfully!`, 'success');
                hideAddToolModal();
                updateToolsList();
                populateScorecardTab();
                updateDashboard();
                updateTeamAnalytics();
            } catch (error) {
                showAlert('Error adding tool: ' + error.message, 'error');
            }
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// User Management Functions
function loginUser() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Please enter your name');
        return;
    }

    if (username.length < 2) {
        alert('Name must be at least 2 characters long');
        return;
    }

    currentUser = {
        name: username,
        id: generateUserId(username),
        loginTime: new Date().toISOString()
    };

    // Initialize user scores if not exist
    if (!userScores[currentUser.id]) {
        userScores[currentUser.id] = {
            user: currentUser,
            scores: {},
            lastUpdated: new Date().toISOString()
        };
    }

    // Update team data
    teamData[currentUser.id] = {
        ...currentUser,
        lastActivity: new Date().toISOString(),
        totalScores: Object.keys(userScores[currentUser.id].scores).length
    };

    saveToStorage();
    showUserInterface();
    // Load user scores after login
    loadUserScores();
    updateDashboard();
    updateTeamAnalytics();
}

function logoutUser() {
    currentUser = null;
    document.getElementById('username').value = '';
    document.getElementById('currentUser').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'inline-block';
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    
    // Clear any unsaved changes
    location.reload();
}

function showUserInterface() {
    document.getElementById('displayName').textContent = currentUser.name;
    document.getElementById('currentUser').style.display = 'flex';
    document.getElementById('loginBtn').style.display = 'none';
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    
    // Load user scores when user interface is shown
    loadUserScores();
}

function generateUserId(username) {
    return username.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now();
}

// Tab Management
function showTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    // Update specific tab content
    switch(tabId) {
        case 'documentation':
            filterDocumentation();
            break;
        case 'scorecard':
            updateScorecardProgress();
            // Load user scores when scorecard tab is shown
            if (currentUser) {
                loadUserScores();
            }
            break;
        case 'dashboard':
            updateDashboard();
            break;
        case 'team':
            updateTeamAnalytics();
            break;
    }
}

// Documentation Tab Functions
function populateDocumentationTab() {
    const tableBody = document.getElementById('docTableBody');
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Clear existing content
    tableBody.innerHTML = '';
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    // Populate category filter
    kpiData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });

    // Populate table
    kpiData.categories.forEach(category => {
        category.kpis.forEach(kpi => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="category-badge">${category.name}</span></td>
                <td><strong>${kpi.name}</strong></td>
                <td>${kpi.description}</td>
                <td><span class="metric-type">${kpi.metricType}</span></td>
                <td>${kpi.evaluationCriteria}</td>
            `;
            row.setAttribute('data-category', category.id);
            row.setAttribute('data-kpi', kpi.id);
            tableBody.appendChild(row);
        });
    });
}

function filterDocumentation() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    const rows = document.querySelectorAll('#docTableBody tr');

    rows.forEach(row => {
        const categoryMatch = !categoryFilter || row.getAttribute('data-category') === categoryFilter;
        const searchMatch = !searchFilter || row.textContent.toLowerCase().includes(searchFilter);
        row.style.display = categoryMatch && searchMatch ? '' : 'none';
    });
}

// Scorecard Tab Functions
function populateScorecardTab() {
    const tableBody = document.getElementById('scorecardTableBody');
    const tableHeader = document.getElementById('scorecardTableHeader');
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Generate dynamic header
    updateScorecardTableHeader();
    
    // Generate table rows
    kpiData.categories.forEach(category => {
        category.kpis.forEach(kpi => {
            const row = document.createElement('tr');
            
            // Category and KPI columns
            let html = `
                <td><span class="category-badge">${category.name}</span></td>
                <td><strong>${kpi.name}</strong></td>
            `;
            
            // Dynamic tool columns
            kpiData.tools.forEach(tool => {
                html += `<td class="tool-score"><input type="number" class="score-input" min="1" max="5" data-tool="${tool.id}" data-kpi="${kpi.id}" data-category="${category.id}" onchange="updateScore(this)" /></td>`;
            });
            
            // Comments and date columns
            html += `
                <td><textarea class="comments-input" data-kpi="${kpi.id}" data-category="${category.id}" placeholder="Add comments..." onchange="updateComment(this)"></textarea></td>
                <td><span class="score-date" id="date-${kpi.id}">-</span></td>
            `;
            
            row.innerHTML = html;
            tableBody.appendChild(row);
        });
    });

    // Load existing scores
    loadUserScores();
}

function updateScorecardTableHeader() {
    const tableHeader = document.getElementById('scorecardTableHeader');
    
    let html = `
        <th>Category</th>
        <th>KPI</th>
    `;
    
    // Dynamic tool columns
    kpiData.tools.forEach(tool => {
        html += `<th class="tool-header" style="background-color: ${tool.color}30; color: #2c3e50;">${tool.name}</th>`;
    });
    
    html += `
        <th>Comments</th>
        <th>Your Score Date</th>
    `;
    
    tableHeader.innerHTML = html;
}

function updateScore(input) {
    if (!currentUser) {
        alert('Please login first to save scores');
        input.value = '';
        return;
    }

    const score = parseInt(input.value);
    if (score < 1 || score > 5) {
        input.classList.add('invalid');
        return;
    } else {
        input.classList.remove('invalid');
    }

    const toolId = input.getAttribute('data-tool');
    const kpiId = input.getAttribute('data-kpi');
    const categoryId = input.getAttribute('data-category');

    // Initialize score structure if needed
    if (!userScores[currentUser.id]) {
        userScores[currentUser.id] = { user: currentUser, scores: {}, lastUpdated: new Date().toISOString() };
    }

    if (!userScores[currentUser.id].scores[kpiId]) {
        userScores[currentUser.id].scores[kpiId] = {
            kpiId,
            categoryId,
            tools: {},
            comment: '',
            lastUpdated: new Date().toISOString()
        };
    }

    userScores[currentUser.id].scores[kpiId].tools[toolId] = score;
    userScores[currentUser.id].scores[kpiId].lastUpdated = new Date().toISOString();
    userScores[currentUser.id].lastUpdated = new Date().toISOString();

    // Update score date
    document.getElementById(`date-${kpiId}`).textContent = new Date().toLocaleDateString();

    // Update team data
    teamData[currentUser.id].lastActivity = new Date().toISOString();
    teamData[currentUser.id].totalScores = Object.keys(userScores[currentUser.id].scores).length;

    saveToStorage();
    updateScorecardProgress();
    updateDashboard();
    updateTeamAnalytics();
}

function updateComment(textarea) {
    if (!currentUser) return;

    const kpiId = textarea.getAttribute('data-kpi');
    const categoryId = textarea.getAttribute('data-category');
    const comment = textarea.value;

    if (!userScores[currentUser.id].scores[kpiId]) {
        userScores[currentUser.id].scores[kpiId] = {
            kpiId,
            categoryId,
            tools: {},
            comment: '',
            lastUpdated: new Date().toISOString()
        };
    }

    userScores[currentUser.id].scores[kpiId].comment = comment;
    userScores[currentUser.id].scores[kpiId].lastUpdated = new Date().toISOString();

    saveToStorage();
}

function loadUserScores() {
    if (!currentUser || !userScores[currentUser.id]) return;

    const scores = userScores[currentUser.id].scores;
    
    Object.keys(scores).forEach(kpiId => {
        const scoreData = scores[kpiId];
        
        // Load tool scores
        Object.keys(scoreData.tools).forEach(toolId => {
            const input = document.querySelector(`[data-kpi="${kpiId}"][data-tool="${toolId}"]`);
            if (input) {
                input.value = scoreData.tools[toolId];
            }
        });

        // Load comment
        const commentInput = document.querySelector(`textarea[data-kpi="${kpiId}"]`);
        if (commentInput) {
            commentInput.value = scoreData.comment || '';
        }

        // Load date
        const dateElement = document.getElementById(`date-${kpiId}`);
        if (dateElement) {
            dateElement.textContent = new Date(scoreData.lastUpdated).toLocaleDateString();
        }
    });

    updateScorecardProgress();
}

function updateScorecardProgress() {
    const totalKPIs = getTotalKPICount();
    let completedKPIs = 0;

    if (currentUser && userScores[currentUser.id]) {
        const scores = userScores[currentUser.id].scores;
        completedKPIs = Object.keys(scores).filter(kpiId => {
            const scoreData = scores[kpiId];
            return Object.keys(scoreData.tools).length > 0;
        }).length;
    }

    const progressPercentage = totalKPIs > 0 ? (completedKPIs / totalKPIs) * 100 : 0;
    
    document.getElementById('progressFill').style.width = progressPercentage + '%';
    document.getElementById('progressText').textContent = `${Math.round(progressPercentage)}% Complete (${completedKPIs}/${totalKPIs})`;
}

// Dashboard Functions
function updateDashboard() {
    updateOverallStats();
    updateOverallChart();
    updateCategoryWinners();
    updateCategoryCharts();
}

function updateOverallStats() {
    const totalKPIs = getTotalKPICount();
    const teamMembers = Object.keys(teamData).length;
    const averageScores = calculateAverageScores();
    const overallWinner = determineOverallWinner(averageScores);

    document.getElementById('totalKPIs').textContent = totalKPIs;
    document.getElementById('teamMemberCount').textContent = teamMembers;
    document.getElementById('activeMembers').textContent = Object.keys(userScores).length;

    if (overallWinner) {
        document.getElementById('overallWinner').textContent = overallWinner.tool;
        document.getElementById('overallWinnerScore').textContent = `Score: ${overallWinner.score.toFixed(1)}`;
    } else {
        document.getElementById('overallWinner').textContent = 'No data';
        document.getElementById('overallWinnerScore').textContent = 'Score: 0';
    }

    // Calculate completion rate
    let totalScored = 0;
    let totalPossible = 0;
    
    Object.keys(userScores).forEach(userId => {
        const scores = userScores[userId].scores;
        Object.keys(scores).forEach(kpiId => {
            const scoreData = scores[kpiId];
            totalScored += Object.keys(scoreData.tools).length;
            totalPossible += kpiData.tools.length;
        });
    });

    const completionRate = totalPossible > 0 ? (totalScored / totalPossible) * 100 : 0;
    document.getElementById('completionRate').textContent = `${Math.round(completionRate)}%`;

    // Calculate average score
    const allScores = [];
    Object.keys(userScores).forEach(userId => {
        const scores = userScores[userId].scores;
        Object.keys(scores).forEach(kpiId => {
            const scoreData = scores[kpiId];
            Object.values(scoreData.tools).forEach(score => {
                allScores.push(score);
            });
        });
    });

    const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
    document.getElementById('avgScore').textContent = `Avg: ${avgScore.toFixed(1)}`;

    document.getElementById('completedKPIs').textContent = `${Object.keys(userScores).length} members active`;
}

function determineOverallWinner(averageScores) {
    let winner = null;
    let highestScore = 0;

    Object.keys(averageScores).forEach(toolId => {
        if (averageScores[toolId] > highestScore) {
            highestScore = averageScores[toolId];
            const tool = getToolById(toolId);
            winner = { tool: tool.name, score: highestScore };
        }
    });

    return winner;
}

// Update chart functions to handle dynamic tools
function updateOverallChart() {
    const ctx = document.getElementById('overallChart').getContext('2d');
    const averageScores = calculateAverageScores();

    // Destroy existing chart
    if (charts.overallChart) {
        charts.overallChart.destroy();
    }

    const labels = kpiData.tools.map(tool => tool.name);
    const data = kpiData.tools.map(tool => averageScores[tool.id] || 0);
    const colors = kpiData.tools.map(tool => tool.color);

    charts.overallChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Score',
                data: data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Overall Tool Performance'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}

function updateCategoryCharts() {
    const chartsContainer = document.getElementById('categoryCharts');
    chartsContainer.innerHTML = '';

    kpiData.categories.forEach(category => {
        const categoryScores = calculateCategoryScores(category.id);
        
        const chartDiv = document.createElement('div');
        chartDiv.className = 'category-chart';
        chartDiv.innerHTML = `
            <h4>${category.name}</h4>
            <canvas id="chart-${category.id}"></canvas>
        `;
        chartsContainer.appendChild(chartDiv);

        // Create chart
        const ctx = document.getElementById(`chart-${category.id}`).getContext('2d');
        const labels = kpiData.tools.map(tool => tool.name);
        const data = kpiData.tools.map(tool => categoryScores[tool.id] || 0);
        const colors = kpiData.tools.map(tool => tool.color);

        charts[`category-${category.id}`] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Score',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5
                    }
                }
            }
        });
    });
}

function updateCategoryWinners() {
    const winnersContainer = document.getElementById('categoryWinners');
    winnersContainer.innerHTML = '';

    kpiData.categories.forEach(category => {
        const categoryScores = calculateCategoryScores(category.id);
        const winner = determineCategoryWinner(categoryScores);

        const winnerCard = document.createElement('div');
        winnerCard.className = 'winner-card';
        winnerCard.innerHTML = `
            <h4>${category.name}</h4>
            <div class="winner-tool">${winner ? winner.tool : 'No data'}</div>
            <div class="winner-score">${winner ? `Score: ${winner.score.toFixed(1)}` : 'No scores yet'}</div>
        `;
        winnersContainer.appendChild(winnerCard);
    });
}

function calculateCategoryScores(categoryId) {
    const toolScores = {};
    
    kpiData.tools.forEach(tool => {
        toolScores[tool.id] = { total: 0, count: 0 };
    });

    // Sum scores for this category
    Object.keys(userScores).forEach(userId => {
        const scores = userScores[userId].scores;
        Object.keys(scores).forEach(kpiId => {
            const scoreData = scores[kpiId];
            if (scoreData.categoryId === categoryId) {
                Object.keys(scoreData.tools).forEach(toolId => {
                    if (toolScores[toolId]) {
                        toolScores[toolId].total += scoreData.tools[toolId];
                        toolScores[toolId].count++;
                    }
                });
            }
        });
    });

    // Calculate averages
    const averages = {};
    Object.keys(toolScores).forEach(toolId => {
        averages[toolId] = toolScores[toolId].count > 0 ? 
            toolScores[toolId].total / toolScores[toolId].count : 0;
    });

    return averages;
}

function determineCategoryWinner(categoryScores) {
    let winner = null;
    let highestScore = 0;

    Object.keys(categoryScores).forEach(toolId => {
        if (categoryScores[toolId] > highestScore) {
            highestScore = categoryScores[toolId];
            const tool = getToolById(toolId);
            winner = { tool: tool.name, score: highestScore };
        }
    });

    return winner;
}

function updateConsensusChart() {
    const ctx = document.getElementById('consensusChart').getContext('2d');
    const consensusData = calculateConsensusData();

    // Destroy existing chart
    if (charts.consensusChart) {
        charts.consensusChart.destroy();
    }

    const labels = kpiData.tools.map(tool => tool.name);
    const data = kpiData.tools.map(tool => consensusData[tool.id] || 0);
    const colors = kpiData.tools.map(tool => tool.color);

    charts.consensusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Team Consensus',
                data: data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Team Tool Preferences'
                }
            }
        }
    });
}

function calculateConsensusData() {
    const toolPreferences = {};
    
    kpiData.tools.forEach(tool => {
        toolPreferences[tool.id] = 0;
    });

    // Count user preferences
    Object.keys(userScores).forEach(userId => {
        const userStats = calculateUserStats(userScores[userId]);
        // Find the tool ID for the favorite tool
        const favoriteTool = kpiData.tools.find(tool => tool.name === userStats.favoriteTool);
        if (favoriteTool) {
            toolPreferences[favoriteTool.id]++;
        }
    });

    return toolPreferences;
}

// Initialize charts object
charts = {};

// Team Analytics Functions
function updateTeamAnalytics() {
    updateTeamList();
    updateUserStatsTable();
    updateConsensusChart();
    updateDisagreementAnalysis();
}

function updateTeamList() {
    const teamList = document.getElementById('teamList');
    teamList.innerHTML = '';

    Object.keys(teamData).forEach(userId => {
        const member = teamData[userId];
        const memberDiv = document.createElement('div');
        memberDiv.className = `team-member ${member.lastActivity ? 'active' : ''}`;
        memberDiv.innerHTML = `
            <h4>${member.name}</h4>
            <div class="member-stats">
                ${member.totalScores || 0} KPIs scored<br>
                Last active: ${member.lastActivity ? new Date(member.lastActivity).toLocaleDateString() : 'Never'}
            </div>
        `;
        teamList.appendChild(memberDiv);
    });
}

function updateUserStatsTable() {
    const tableBody = document.getElementById('userStatsTableBody');
    tableBody.innerHTML = '';

    Object.keys(userScores).forEach(userId => {
        const userScore = userScores[userId];
        const stats = calculateUserStats(userScore);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${userScore.user.name}</strong></td>
            <td>${stats.completedKPIs}</td>
            <td>${stats.avgScore.toFixed(1)}</td>
            <td>${stats.favoriteTool}</td>
            <td>${new Date(userScore.lastUpdated).toLocaleDateString()}</td>
            <td>${stats.contributionPercentage.toFixed(1)}%</td>
        `;
        tableBody.appendChild(row);
    });
}

function calculateUserStats(userScore) {
    const scores = userScore.scores;
    const completedKPIs = Object.keys(scores).length;
    const allScores = [];
    const toolCounts = {};

    Object.keys(scores).forEach(kpiId => {
        const scoreData = scores[kpiId];
        Object.keys(scoreData.tools).forEach(toolId => {
            allScores.push(scoreData.tools[toolId]);
            toolCounts[toolId] = (toolCounts[toolId] || 0) + 1;
        });
    });

    const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
    
    let favoriteTool = 'None';
    let maxCount = 0;
    Object.keys(toolCounts).forEach(toolId => {
        if (toolCounts[toolId] > maxCount) {
            maxCount = toolCounts[toolId];
            const tool = getToolById(toolId);
            favoriteTool = tool ? tool.name : toolId;
        }
    });

    const totalPossibleScores = getTotalKPICount() * kpiData.tools.length;
    const contributionPercentage = totalPossibleScores > 0 ? (allScores.length / totalPossibleScores) * 100 : 0;

    return {
        completedKPIs,
        avgScore,
        favoriteTool,
        contributionPercentage
    };
}

function updateDisagreementAnalysis() {
    const disagreementList = document.getElementById('disagreementList');
    disagreementList.innerHTML = '';

    const disagreements = findDisagreements();
    
    if (disagreements.length === 0) {
        disagreementList.innerHTML = '<p>No significant disagreements found.</p>';
        return;
    }

    disagreements.forEach(disagreement => {
        const item = document.createElement('div');
        item.className = 'disagreement-item';
        item.innerHTML = `
            <h4>${disagreement.kpiName}</h4>
            <div class="disagreement-details">
                <strong>Category:</strong> ${disagreement.categoryName}<br>
                <strong>Standard Deviation:</strong> ${disagreement.stdDev.toFixed(2)}<br>
                <strong>Score Range:</strong> ${disagreement.minScore} - ${disagreement.maxScore}<br>
                <strong>Tool Averages:</strong> ${disagreement.toolAverages}
            </div>
        `;
        disagreementList.appendChild(item);
    });
}

function findDisagreements() {
    const disagreements = [];
    const disagreementThreshold = 1.5; // Standard deviation threshold

    kpiData.categories.forEach(category => {
        category.kpis.forEach(kpi => {
            const kpiScores = collectKPIScores(kpi.id);
            
            if (kpiScores.length < 2) return; // Need at least 2 scores to measure disagreement
            
            const stdDev = calculateStandardDeviation(kpiScores);
            if (stdDev > disagreementThreshold) {
                const toolAverages = calculateKPIToolAverages(kpi.id);
                disagreements.push({
                    kpiId: kpi.id,
                    kpiName: kpi.name,
                    categoryName: category.name,
                    stdDev,
                    minScore: Math.min(...kpiScores),
                    maxScore: Math.max(...kpiScores),
                    toolAverages: formatToolAverages(toolAverages)
                });
            }
        });
    });

    return disagreements.sort((a, b) => b.stdDev - a.stdDev);
}

function collectKPIScores(kpiId) {
    const scores = [];
    
    Object.keys(userScores).forEach(userId => {
        const userScore = userScores[userId];
        if (userScore.scores[kpiId]) {
            Object.values(userScore.scores[kpiId].tools).forEach(score => {
                scores.push(score);
            });
        }
    });

    return scores;
}

function calculateStandardDeviation(scores) {
    if (scores.length === 0) return 0;
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
}

function calculateKPIToolAverages(kpiId) {
    const toolScores = {};
    
    kpiData.tools.forEach(tool => {
        toolScores[tool.id] = [];
    });

    Object.keys(userScores).forEach(userId => {
        const userScore = userScores[userId];
        if (userScore.scores[kpiId]) {
            Object.keys(userScore.scores[kpiId].tools).forEach(toolId => {
                if (toolScores[toolId]) {
                    toolScores[toolId].push(userScore.scores[kpiId].tools[toolId]);
                }
            });
        }
    });

    const averages = {};
    Object.keys(toolScores).forEach(toolId => {
        const scores = toolScores[toolId];
        averages[toolId] = scores.length > 0 ? 
            scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    });

    return averages;
}

function formatToolAverages(toolAverages) {
    return Object.keys(toolAverages).map(toolId => {
        const tool = getToolById(toolId);
        return `${tool.name}: ${toolAverages[toolId].toFixed(1)}`;
    }).join(', ');
}

// Data Management Functions
function saveScores() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    saveToStorage();
    alert('Scores saved successfully!');
}

function exportScores() {
    const exportData = {
        userScores,
        teamData,
        customTools: kpiData.tools.filter(tool => !tool.isDefault),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kpi_scores_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importScores() {
    document.getElementById('importFile').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            if (importData.userScores) {
                userScores = { ...userScores, ...importData.userScores };
            }
            if (importData.teamData) {
                teamData = { ...teamData, ...importData.teamData };
            }
            if (importData.customTools) {
                // Merge custom tools
                const existingCustomTools = kpiData.tools.filter(tool => !tool.isDefault);
                const newCustomTools = importData.customTools.filter(tool => 
                    !existingCustomTools.some(existing => existing.id === tool.id)
                );
                kpiData.tools = [...kpiData.tools.filter(tool => tool.isDefault), ...existingCustomTools, ...newCustomTools];
                saveCustomTools();
            }

            saveToStorage();
            loadUserScores();
            updateToolsList();
            populateScorecardTab();
            updateDashboard();
            updateTeamAnalytics();
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEYS.USER_SCORES, JSON.stringify(userScores));
    localStorage.setItem(STORAGE_KEYS.TEAM_DATA, JSON.stringify(teamData));
}

function loadFromStorage() {
    const savedScores = localStorage.getItem(STORAGE_KEYS.USER_SCORES);
    const savedTeamData = localStorage.getItem(STORAGE_KEYS.TEAM_DATA);

    if (savedScores) {
        userScores = JSON.parse(savedScores);
    }
    if (savedTeamData) {
        teamData = JSON.parse(savedTeamData);
    }
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString();
}

function getTotalKPICount() {
    return kpiData.categories.reduce((total, category) => total + category.kpis.length, 0);
}

function getToolById(toolId) {
    return kpiData.tools.find(tool => tool.id === toolId);
}

function getAllKPIs() {
    const allKPIs = [];
    kpiData.categories.forEach(category => {
        category.kpis.forEach(kpi => {
            allKPIs.push({
                ...kpi,
                categoryId: category.id,
                categoryName: category.name
            });
        });
    });
    return allKPIs;
}

function calculateAverageScores() {
    const toolScores = {};
    
    // Initialize tool scores
    kpiData.tools.forEach(tool => {
        toolScores[tool.id] = { total: 0, count: 0 };
    });

    // Sum all scores for each tool
    Object.keys(userScores).forEach(userId => {
        const scores = userScores[userId].scores;
        Object.keys(scores).forEach(kpiId => {
            const scoreData = scores[kpiId];
            Object.keys(scoreData.tools).forEach(toolId => {
                if (toolScores[toolId]) {
                    toolScores[toolId].total += scoreData.tools[toolId];
                    toolScores[toolId].count++;
                }
            });
        });
    });

    // Calculate averages
    const averages = {};
    Object.keys(toolScores).forEach(toolId => {
        averages[toolId] = toolScores[toolId].count > 0 ? 
            toolScores[toolId].total / toolScores[toolId].count : 0;
    });

    return averages;
}

// Add some sample data for demonstration
function addSampleData() {
    const sampleUsers = [
        { id: 'user1', name: 'Alice Developer' },
        { id: 'user2', name: 'Bob Engineer' },
        { id: 'user3', name: 'Carol Architect' }
    ];

    sampleUsers.forEach(user => {
        userScores[user.id] = {
            user: user,
            scores: {},
            lastUpdated: new Date().toISOString()
        };

        teamData[user.id] = {
            ...user,
            lastActivity: new Date().toISOString(),
            totalScores: 0
        };

        // Add some random scores
        kpiData.categories.forEach(category => {
            category.kpis.forEach(kpi => {
                if (Math.random() > 0.7) { // 30% chance of scoring
                    userScores[user.id].scores[kpi.id] = {
                        kpiId: kpi.id,
                        categoryId: category.id,
                        tools: {},
                        comment: '',
                        lastUpdated: new Date().toISOString()
                    };

                    kpiData.tools.forEach(tool => {
                        if (Math.random() > 0.5) { // 50% chance of scoring each tool
                            userScores[user.id].scores[kpi.id].tools[tool.id] = 
                                Math.floor(Math.random() * 5) + 1;
                        }
                    });

                    teamData[user.id].totalScores++;
                }
            });
        });
    });
}

// Uncomment this line to add sample data for testing
// addSampleData(); 