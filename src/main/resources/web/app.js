// Assuming client.js contains the ScrumChatClient class definition

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authModal = document.getElementById('authModal');
    const appContainer = document.getElementById('appContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTabs = document.querySelectorAll('.auth-tab');
    const logoutBtn = document.getElementById('logoutBtn');
    const createTeamModal = document.getElementById('createTeamModal');
    const createTeamForm = document.getElementById('createTeamForm');
    const addTeamButton = document.querySelector('.add-team-button');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const teamsList = document.getElementById('teamsList');
    const sprintsList = document.getElementById('sprintsList');
    const startSprintBtn = document.getElementById('startSprintBtn');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const currentTeamHeader = document.getElementById('currentTeamHeader');
    const currentSprintName = document.getElementById('currentSprintName');
    const currentUsername = document.getElementById('currentUsername');

    // State
    let currentUser = null;
    let currentTeam = null;
    let currentSprint = null;
    let teams = [];
    let sprints = [];

    // Initialize client
    const client = new ScrumChatClient();

    // Check if user is already logged in
    const init = async () => {
        if (client.token) {
            try {
                // Fetch user data and teams
                // For now, let's just show the main interface
                showApp();
                loadTeams(); // This would be implemented to fetch teams from API
            } catch (error) {
                console.error('Session expired or invalid', error);
                client.logout();
                showAuth();
            }
        } else {
            showAuth();
        }
    };

    // Show auth modal
    const showAuth = () => {
        authModal.style.display = 'flex';
        appContainer.style.display = 'none';
    };

    // Show main app
    const showApp = () => {
        authModal.style.display = 'none';
        appContainer.style.display = 'grid';
        
        // Set current username if available
        if (currentUser) {
            currentUsername.textContent = currentUser.username;
        }
    };

    // Handle auth tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            const tabType = tab.getAttribute('data-tab');
            document.getElementById(`${tabType}Form`).classList.add('active');
        });
    });

    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            await client.login(username, password);
            currentUser = { username }; // In real app, fetch user details from API
            showApp();
            loadTeams();
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });

    // Handle registration
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        try {
            await client.register(username, password);
            currentUser = { username }; // In real app, fetch user details from API
            showApp();
            loadTeams();
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    });

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        client.logout();
        currentUser = null;
        currentTeam = null;
        currentSprint = null;
        teams = [];
        sprints = [];
        showAuth();
    });

    // Show create team modal
    addTeamButton.addEventListener('click', () => {
        createTeamModal.style.display = 'flex';
    });

    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Handle team creation
    createTeamForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const teamName = document.getElementById('teamName').value;
        
        try {
            const team = await client.createTeam(teamName);
            teams.push(team);
            renderTeams();
            createTeamModal.style.display = 'none';
            selectTeam(team);
        } catch (error) {
            alert('Failed to create team: ' + error.message);
        }
    });

    // Load teams from API
    const loadTeams = async () => {
        try {
            const fetchedTeams = await client.getAllTeams();
            teams = fetchedTeams;
            renderTeams();
            if (teams.length > 0) {
                selectTeam(teams[0]); // Select first team by default
            }
        } catch (error) {
            console.error('Failed to load teams', error);
        }
    };

    // Render teams in sidebar
    const renderTeams = () => {
        teamsList.innerHTML = '';
        teams.forEach(team => {
            const teamIcon = document.createElement('div');
            teamIcon.className = 'team-icon';
            teamIcon.textContent = team.name.charAt(0).toUpperCase();
            teamIcon.title = team.name;
            teamIcon.dataset.id = team.id;
            
            if (currentTeam && team.id === currentTeam.id) {
                teamIcon.classList.add('active');
            }
            
            teamIcon.addEventListener('click', () => {
                selectTeam(team);
            });
            
            teamsList.appendChild(teamIcon);
        });
    };

    // Select a team
    const selectTeam = async (team) => {
        currentTeam = team;
        currentTeamHeader.querySelector('h3').textContent = team.name;
        
        // Update UI to show this team is selected
        document.querySelectorAll('.team-icon').forEach(icon => {
            icon.classList.remove('active');
            if (icon.dataset.id === team.id) {
                icon.classList.add('active');
            }
        });
        
        // Load sprints for this team
        await loadSprints(team.id);
    };

    // Load sprints for a team
    const loadSprints = async (teamId) => {
        try {
            const fetchedSprints = await client.getSprintsByTeamId(teamId);
            sprints = fetchedSprints; // Replace placeholder with fetched sprints
            renderSprints();
        } catch (error) {
            console.error('Failed to load sprints', error);
        }
    };

    // Render sprints in sidebar
    const renderSprints = () => {
        sprintsList.innerHTML = '';
        
        if (sprints.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No active sprints';
            sprintsList.appendChild(emptyState);
            return;
        }
        
        sprints.forEach(sprint => {
            const sprintItem = document.createElement('div');
            sprintItem.className = 'channel-item';
            sprintItem.innerHTML = `<i class="fas fa-hashtag"></i> <span>${sprint.name}</span>`;
            
            if (currentSprint && sprint.id === currentSprint.id) {
                sprintItem.classList.add('active');
            }
            
            sprintItem.addEventListener('click', () => {
                selectSprint(sprint);
            });
            
            sprintsList.appendChild(sprintItem);
        });
    };

    // Handle starting a new sprint
    startSprintBtn.addEventListener('click', async () => {
        if (!currentTeam) return;
        
        const sprintName = prompt("Enter sprint name:", "Sprint Name");
        if (!sprintName) return;

        try {
            const sprint = await client.startSprint(currentTeam.id, sprintName);
            sprints.push(sprint);
            renderSprints();
            selectSprint(sprint);
        } catch (error) {
            alert('Failed to start sprint: ' + error.message);
        }
    });

    // Select a sprint
    const selectSprint = async (sprint) => {
        // Disconnect from current sprint if any
        if (currentSprint) {
            client.disconnectWebSocket();
        }
        
        currentSprint = sprint;
        currentSprintName.textContent = sprint.name;
        
        // Update UI to show this sprint is selected
        document.querySelectorAll('.channel-item').forEach(item => {
            item.classList.remove('active');
            if (item.querySelector('span').textContent === `${sprint.name}`) {
                item.classList.add('active');
            }
        });
        
        // Clear chat messages
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to Sprint ${sprint.name}!</h2>
                <p>This is the beginning of your sprint discussion.</p>
            </div>
        `;
        
        // Connect to WebSocket for this sprint
        client.connectWebSocket(sprint.id, (message) => {
            displayMessage(JSON.parse(message.body));
        });
    };

    // Display a chat message
    const displayMessage = (message) => {
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';
        
        messageGroup.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${message.sender || 'User'}</span>
                    <span class="message-timestamp">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="message-text">${message.content}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageGroup);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Send message on Enter
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send message function
    const sendMessage = () => {
        if (!currentSprint) return;
        
        const content = messageInput.value.trim();
        if (!content) return;
        
        client.sendMessage(currentSprint.id, content);
        messageInput.value = '';
    };

    // When click outside modal, close it
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Initialize the app
    init();
});