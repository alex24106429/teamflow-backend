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
    const epicsList = document.getElementById('epicsList'); // New: Epics list
    const startSprintBtn = document.getElementById('startSprintBtn');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const currentTeamHeader = document.getElementById('currentTeamHeader');
    const currentSprintName = document.getElementById('currentSprintName');
    const currentUsername = document.getElementById('currentUsername');
    const createEpicModal = document.getElementById('createEpicModal'); // New: Create Epic Modal
    const createEpicForm = document.getElementById('createEpicForm'); // New: Create Epic Form
    const addEpicButton = document.getElementById('addEpicButton'); // New: Add Epic Button
    const editEpicModal = document.getElementById('editEpicModal'); // New: Edit Epic Modal
    const editEpicForm = document.getElementById('editEpicForm'); // New: Edit Epic Form
    const editEpicNameInput = document.getElementById('editEpicName'); // New: Edit Epic Name Input
    const editEpicDescriptionInput = document.getElementById('editEpicDescription'); // New: Edit Epic Description Input
    const userStoriesList = document.getElementById('userStoriesList'); // New: User Stories list
    const tasksList = document.getElementById('tasksList'); // New: Tasks list
    const createUserStoryModal = document.getElementById('createUserStoryModal'); // New: Create User Story Modal
    const createUserStoryForm = document.getElementById('createUserStoryForm'); // New: Create User Story Form
    const createTaskModal = document.getElementById('createTaskModal'); // New: Create Task Modal
    const createTaskForm = document.getElementById('createTaskForm'); // New: Create Task Form

    // State
    let currentUser = null;
    let currentTeam = null;
    let currentSprint = null;
    let teams = [];
    let sprints = [];
    let epics = []; // New: Epics state
    let selectedEpic = null; // New: Selected Epic
    let userStories = []; // New: User Stories state
    let tasks = []; // New: Tasks state

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
        epics = []; // Clear epics on logout
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
        // Load epics for this team
        await loadEpics(team.id); // New: Load epics when team is selected
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
        
        // Clear chat messages and load history
        chatMessages.innerHTML = '';
        
        try {
            // Load historical messages
            const messages = await client.getMessages(sprint.id);
            messages.forEach(message => displayMessage(message));
            
            // Connect to WebSocket for real-time updates
            client.connectWebSocket(sprint.id, (message) => {
                displayMessage(JSON.parse(message.body));
            });
        } catch (error) {
            console.error('Failed to load messages:', error);
            chatMessages.innerHTML = `
                <div class="error-message">
                    Failed to load messages: ${error.message}
                </div>
            `;
        }
        // Load user stories for this sprint
        await loadUserStories(sprint);
    };

    // Display a chat message (updated to handle historical data)
    const displayMessage = (message) => {
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';
        
        // Format timestamp from message data
        const messageDate = new Date(message.createdAt);
        const formattedDate = messageDate.toLocaleDateString();
        const formattedTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageGroup.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${message.sender?.username || 'Unknown User'}</span>
                    <span class="message-timestamp">${formattedDate} ${formattedTime}</span>
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

    // Load epics for a team
    const loadEpics = async (teamId) => {
        try {
            const fetchedEpics = await client.getAllEpicsByTeamId(teamId);
            epics = fetchedEpics;
            renderEpics();
        } catch (error) {
            console.error('Failed to load epics', error);
        }
    };

    // Render epics in sidebar
    const renderEpics = () => {
        epicsList.innerHTML = '';
        
        if (epics.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No epics yet';
            epicsList.appendChild(emptyState);
            return;
        }
        
        epics.forEach(epic => {
            const epicItem = document.createElement('div');
            epicItem.className = 'channel-item'; // Reusing channel-item style
            epicItem.innerHTML = `<i class="fas fa-bookmark"></i> <span>${epic.name}</span>`; // Using bookmark icon for epics

            epicItem.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                selectedEpic = epic; // Store the selected epic

                const contextMenu = document.createElement('div');
                contextMenu.className = 'context-menu';
                contextMenu.style.position = 'absolute';
                contextMenu.style.left = event.clientX + 'px';
                contextMenu.style.top = event.clientY + 'px';
                contextMenu.innerHTML = `
                    <div class="context-menu-item" id="editEpic">Edit</div>
                    <div class="context-menu-item" id="deleteEpic">Delete</div>
                `;
                document.body.appendChild(contextMenu);

                // Event listeners for context menu items
                document.getElementById('editEpic').addEventListener('click', () => {
                    showEditEpicModal(epic);
                    contextMenu.remove();
                });
                document.getElementById('deleteEpic').addEventListener('click', () => {
                    deleteEpic(epic);
                    contextMenu.remove();
                });

                // Close context menu on outside click
                document.addEventListener('click', function outsideClickListener(event) {
                    if (!contextMenu.contains(event.target)) {
                        contextMenu.remove();
                        document.removeEventListener('click', outsideClickListener);
                    }
                });
            });
            
            epicsList.appendChild(epicItem);
        });
    };

    // Show create epic modal
    addEpicButton.addEventListener('click', () => {
        createEpicModal.style.display = 'flex';
    });

    // Handle epic creation
    createEpicForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const epicName = document.getElementById('epicName').value;
        if (!currentTeam) return;

        try {
            const epic = await client.createEpic(currentTeam.id, { name: epicName });
            epics.push(epic);
            renderEpics();
            createEpicModal.style.display = 'none';
        } catch (error) {
            alert('Failed to create epic: ' + error.message);
        }
    });

    // Show edit epic modal
    const showEditEpicModal = (epic) => {
        editEpicNameInput.value = epic.name;
        editEpicDescriptionInput.value = epic.description || '';
        editEpicModal.style.display = 'flex';
    };

    // Handle epic update
    editEpicForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedEpic) return;

        const epicName = editEpicNameInput.value;
        const epicDescription = editEpicDescriptionInput.value;

        try {
            const updatedEpic = await client.updateEpic(selectedEpic.id, { name: epicName, description: epicDescription });
            // Update the epic in the epics array
            epics = epics.map(epic => epic.id === selectedEpic.id ? updatedEpic : epic);
            renderEpics();
            editEpicModal.style.display = 'none';
        } catch (error) {
            alert('Failed to update epic: ' + error.message);
        }
    });

    // Handle epic deletion
    const deleteEpic = async (epic) => {
        if (!confirm('Are you sure you want to delete this epic?')) return;

        try {
            await client.deleteEpic(epic.id);
            epics = epics.filter(e => e.id !== epic.id);
            renderEpics();
        } catch (error) {
            alert('Failed to delete epic: ' + error.message);
        }
    };

    // Load user stories for a sprint
    const loadUserStories = async (sprint) => {
        try {
            // Assuming sprint object has epicId
            const userStories = await client.getAllUserStoriesByEpicId(sprint.epicId);
            renderUserStories(userStories);
        } catch (error) {
            console.error('Failed to load user stories', error);
        }
    };

    // Render user stories in sidebar
    const renderUserStories = (userStories) => {
        userStoriesList.innerHTML = '';

        if (userStories.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No user stories yet';
            userStoriesList.appendChild(emptyState);
            return;
        }

        userStories.forEach(userStory => {
            const userStoryItem = document.createElement('div');
            userStoryItem.className = 'channel-item';
            userStoryItem.innerHTML = `<i class="fas fa-list"></i> <span>${userStory.name}</span>`;
            userStoriesList.appendChild(userStoryItem);
        });
    };

    // Initialize the app
    init();
});