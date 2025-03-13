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

// Home view elements
const homeView = document.getElementById('homeView');
const chatView = document.getElementById('chatView');
const homeIcon = document.querySelector('.home-icon');
const homeTeamsList = document.getElementById('homeTeamsList');
const homeRecentEpics = document.getElementById('homeRecentEpics');
const homeActiveSprints = document.getElementById('homeActiveSprints');
const homeCreateTeamBtn = document.getElementById('homeCreateTeamBtn');
const emptyTeamsState = document.getElementById('emptyTeamsState');

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
let currentView = 'home'; // Track current view: 'home' or 'chat'

// Check if user is already logged in
const init = async () => {
	if (client.token) {
		try {
			// Get username from localStorage
			const savedUsername = localStorage.getItem('teamflow_username');
			if (savedUsername) {
				currentUser = { username: savedUsername };
			}
			
			// Fetch user data and teams
			showApp();
			await loadTeams(); // Load teams from API
			showHomeView(); // Show home view by default
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

// Show home view
const showHomeView = () => {
	homeView.style.display = 'flex';
	chatView.style.display = 'none';
	currentView = 'home';
	
	// Add home-mode class to body for CSS targeting
	document.body.classList.add('home-mode');
	
	// Mark home icon as active and remove active from team icons
	document.querySelectorAll('.team-icon').forEach(icon => {
		icon.classList.remove('active');
	});
	homeIcon.classList.add('active');
	
	// Update home page content
	updateHomeContent();
};

// Show chat view
const showChatView = () => {
	homeView.style.display = 'none';
	chatView.style.display = 'flex';
	currentView = 'chat';
	
	// Remove home-mode class from body
	document.body.classList.remove('home-mode');
	
	// Remove active from home icon
	homeIcon.classList.remove('active');
};

// Update home content
const updateHomeContent = () => {
	// Update teams list in home view
	renderHomeTeams();
	
	// Update recent epics
	renderHomeEpics();
	
	// Update active sprints
	renderHomeSprints();
};

// Render teams in home view
const renderHomeTeams = () => {
	// Clear previous content except the empty state
	const currentEmptyState = homeTeamsList.querySelector('.empty-home-state');
	homeTeamsList.innerHTML = '';
	
	if (teams.length === 0) {
		// Show empty state
		homeTeamsList.appendChild(currentEmptyState);
		return;
	}
	
	// Hide empty state when we have teams
	teams.forEach(team => {
		const teamItem = document.createElement('div');
		teamItem.className = 'home-team-item';
		
		const teamIcon = document.createElement('div');
		teamIcon.className = 'home-team-icon';
		teamIcon.textContent = team.name.charAt(0).toUpperCase();
		
		const teamName = document.createElement('div');
		teamName.className = 'home-team-name';
		teamName.textContent = team.name;
		
		teamItem.appendChild(teamIcon);
		teamItem.appendChild(teamName);
		
		teamItem.addEventListener('click', () => {
			selectTeam(team);
			showChatView();
		});
		
		homeTeamsList.appendChild(teamItem);
	});
};

// Render recent epics in home view
const renderHomeEpics = () => {
	homeRecentEpics.innerHTML = '';
	
	if (epics.length === 0) {
		const emptyState = document.createElement('div');
		emptyState.className = 'empty-home-state';
		emptyState.innerHTML = '<p>No recent epics to display.</p>';
		homeRecentEpics.appendChild(emptyState);
		return;
	}
	
	// Show up to 3 most recent epics
	const recentEpics = epics.slice(0, 3);
	recentEpics.forEach(epic => {
		const epicItem = document.createElement('div');
		epicItem.className = 'home-team-item'; // Reuse the same style
		
		const epicIcon = document.createElement('div');
		epicIcon.className = 'home-team-icon';
		epicIcon.innerHTML = '<i class="fas fa-bookmark"></i>';
		
		const epicName = document.createElement('div');
		epicName.className = 'home-team-name';
		epicName.textContent = epic.name;
		
		epicItem.appendChild(epicIcon);
		epicItem.appendChild(epicName);
		
		homeRecentEpics.appendChild(epicItem);
	});
};

// Render active sprints in home view
const renderHomeSprints = () => {
	homeActiveSprints.innerHTML = '';
	
	if (sprints.length === 0) {
		const emptyState = document.createElement('div');
		emptyState.className = 'empty-home-state';
		emptyState.innerHTML = '<p>No active sprints to display.</p>';
		homeActiveSprints.appendChild(emptyState);
		return;
	}
	
	// Show up to 3 most recent sprints
	const activeSprints = sprints.slice(0, 3);
	activeSprints.forEach(sprint => {
		const sprintItem = document.createElement('div');
		sprintItem.className = 'home-team-item'; // Reuse the same style
		
		const sprintIcon = document.createElement('div');
		sprintIcon.className = 'home-team-icon';
		sprintIcon.innerHTML = '<i class="fas fa-running"></i>';
		
		const sprintName = document.createElement('div');
		sprintName.className = 'home-team-name';
		sprintName.textContent = sprint.name;
		
		sprintItem.appendChild(sprintIcon);
		sprintItem.appendChild(sprintName);
		
		sprintItem.addEventListener('click', () => {
			if (currentTeam) {
				selectSprint(sprint);
				showChatView();
			}
		});
		
		homeActiveSprints.appendChild(sprintItem);
	});
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
		
		// Store username in localStorage for persistence
		localStorage.setItem('teamflow_username', username);
		
		showApp();
		await loadTeams();
		showHomeView(); // Show home view after login
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
		
		// Store username in localStorage for persistence
		localStorage.setItem('teamflow_username', username);
		
		showApp();
		await loadTeams();
		showHomeView(); // Show home view after registration
	} catch (error) {
		alert('Registration failed: ' + error.message);
	}
});

// Handle logout
logoutBtn.addEventListener('click', () => {
	client.logout();
	localStorage.removeItem('teamflow_username'); // Clear stored username
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
		renderHomeTeams(); // Update home view teams list
		
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
	
	if (teams.length === 0) {
		// Add a helpful message when there are no teams
		const emptyTeamsMessage = document.createElement('div');
		emptyTeamsMessage.className = 'empty-state';
		emptyTeamsMessage.innerHTML = `
			<p>No teams yet</p>
			<p>Click + below to create one</p>
		`;
		teamsList.appendChild(emptyTeamsMessage);
		return;
	}
	
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
			showChatView(); // Switch to chat view when team is selected
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
		
		// Add context menu for sprint channels
		sprintItem.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			
			const contextMenu = document.createElement('div');
			contextMenu.className = 'context-menu';
			contextMenu.style.position = 'absolute';
			contextMenu.style.left = event.clientX + 'px';
			contextMenu.style.top = event.clientY + 'px';
			contextMenu.innerHTML = `
				<div class="context-menu-item" id="renameSprint">Rename</div>
				<div class="context-menu-item" id="deleteSprint">Delete</div>
			`;
			document.body.appendChild(contextMenu);
			
			// Event listeners for context menu items
			document.getElementById('renameSprint').addEventListener('click', () => {
				showRenameSprintModal(sprint);
				contextMenu.remove();
			});
			document.getElementById('deleteSprint').addEventListener('click', () => {
				deleteSprint(sprint);
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
		
		sprintsList.appendChild(sprintItem);
	});
};

// Handle starting a new sprint - show modal
startSprintBtn.addEventListener('click', () => {
	if (!currentTeam) {
		alert('Please select a team first');
		return;
	}
	
	document.getElementById('startSprintModal').style.display = 'flex';
});

// Handle sprint creation form submission
document.getElementById('startSprintForm').addEventListener('submit', async (e) => {
	e.preventDefault();
	
	const sprintName = document.getElementById('sprintName').value;
	if (!sprintName) return;

	try {
		const sprint = await client.startSprint(currentTeam.id, sprintName);
		sprints.push(sprint);
		renderSprints();
		selectSprint(sprint);
		document.getElementById('startSprintModal').style.display = 'none';
		document.getElementById('sprintName').value = ''; // Clear the input
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
	let formattedDate = '';
	let formattedTime = '';
	
	if (message.createdAt) {
		try {
			const messageDate = new Date(message.createdAt);
			if (!isNaN(messageDate.getTime())) {
				formattedDate = messageDate.toLocaleDateString();
				formattedTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			} else {
				formattedDate = 'Today';
				formattedTime = 'Just now';
			}
		} catch (e) {
			formattedDate = 'Today';
			formattedTime = 'Just now';
		}
	} else {
		formattedDate = 'Today';
		formattedTime = 'Just now';
	}
	
	// Get username safely
	const username = message.sender && message.sender.username ?
		message.sender.username :
		(currentUser ? currentUser.username : 'Unknown User');
	
	messageGroup.innerHTML = `
		<div class="message-avatar">
			<i class="fas fa-user"></i>
		</div>
		<div class="message-content">
			<div class="message-header">
				<span class="message-author">${username}</span>
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
		
		// Add selected-epic class if this epic is selected
		if (selectedEpic && selectedEpic.id === epic.id) {
			epicItem.classList.add('selected-epic');
		}
		
		epicItem.innerHTML = `<i class="fas fa-bookmark"></i> <span>${epic.name}</span>`; // Using bookmark icon for epics

		// Add click handler to select/deselect epic
		epicItem.addEventListener('click', () => {
			if (selectedEpic && selectedEpic.id === epic.id) {
				// Deselect if already selected
				selectedEpic = null;
				epicItem.classList.remove('selected-epic');
				// Clear user stories
				userStories = [];
				renderUserStories();
				// Clear tasks
				tasks = [];
				renderTasks();
			} else {
				// Select this epic
				selectEpic(epic);
			}
		});

		// Add context menu for edit/delete
		epicItem.addEventListener('contextmenu', (event) => {
			event.preventDefault();

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

// DOM Elements for new buttons
const addUserStoryButton = document.getElementById('addUserStoryButton');
const addTaskButton = document.getElementById('addTaskButton');

// Show create epic modal
addEpicButton.addEventListener('click', () => {
	createEpicModal.style.display = 'flex';
});

// Show create user story modal when button is clicked
addUserStoryButton.addEventListener('click', () => {
	if (!selectedEpic) {
		alert('Please select an epic first by right-clicking on an epic and selecting "Select Epic"');
		return;
	}
	showCreateUserStoryModal(selectedEpic.id);
});

// Show create task modal when button is clicked
addTaskButton.addEventListener('click', () => {
	// Find the active user story
	const activeUserStoryItem = document.querySelector('.channel-item.active');
	if (!activeUserStoryItem) {
		alert('Please select a user story first');
		return;
	}
	
	const userStoryName = activeUserStoryItem.querySelector('span').textContent;
	const userStory = userStories.find(us => us.name === userStoryName);
	if (userStory) {
		showCreateTaskModal(userStory.id);
	} else {
		alert('Please select a user story first');
	}
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

// Select an epic
const selectEpic = (epic) => {
	selectedEpic = epic;
	
	// Update UI to show this epic is selected
	document.querySelectorAll('.channel-item').forEach(item => {
		item.classList.remove('selected-epic');
		if (item.querySelector('span').textContent === epic.name &&
			item.querySelector('i').classList.contains('fa-bookmark')) {
			item.classList.add('selected-epic');
		}
	});
	
	// Load user stories for this epic
	loadUserStoriesForEpic(epic.id);
};

// Load user stories for an epic
const loadUserStoriesForEpic = async (epicId) => {
	try {
		const fetchedUserStories = await client.getAllUserStoriesByEpicId(epicId);
		userStories = fetchedUserStories;
		renderUserStories();
	} catch (error) {
		console.error('Failed to load user stories', error);
		userStories = [];
		renderUserStories();
	}
};

// Handle epic deletion
const deleteEpic = async (epic) => {
	if (!confirm('Are you sure you want to delete this epic?')) return;

	try {
		await client.deleteEpic(epic.id);
		epics = epics.filter(e => e.id !== epic.id);
		renderEpics();
		
		// Clear selected epic if it's the one being deleted
		if (selectedEpic && selectedEpic.id === epic.id) {
			selectedEpic = null;
			userStories = [];
			renderUserStories();
			tasks = [];
			renderTasks();
		}
	} catch (error) {
		alert('Failed to delete epic: ' + error.message);
	}
};

// Show rename sprint modal
const showRenameSprintModal = (sprint) => {
	// Create modal if it doesn't exist
	let renameSprintModal = document.getElementById('renameSprintModal');
	if (!renameSprintModal) {
		renameSprintModal = document.createElement('div');
		renameSprintModal.id = 'renameSprintModal';
		renameSprintModal.className = 'modal';
		renameSprintModal.innerHTML = `
			<div class="modal-content">
				<div class="modal-header">
					<h2>Rename Sprint</h2>
					<span class="close-modal">&times;</span>
				</div>
				<div class="modal-body">
					<form id="renameSprintForm">
						<div class="form-group">
							<label for="newSprintName">Sprint Name</label>
							<input type="text" id="newSprintName" required>
						</div>
						<button type="submit" class="modal-button">Rename</button>
					</form>
				</div>
			</div>
		`;
		document.body.appendChild(renameSprintModal);
		
		// Add close button functionality
		renameSprintModal.querySelector('.close-modal').addEventListener('click', () => {
			renameSprintModal.style.display = 'none';
		});
		
		// Add form submission handler
		document.getElementById('renameSprintForm').addEventListener('submit', async (e) => {
			e.preventDefault();
			const newName = document.getElementById('newSprintName').value;
			if (!newName) return;
			
			try {
				const updatedSprint = await client.updateSprint(currentRenamingSprint.id, newName);
				// Update sprint in the sprints array
				sprints = sprints.map(s => s.id === updatedSprint.id ? updatedSprint : s);
				renderSprints();
				
				// Update current sprint if it's the one being renamed
				if (currentSprint && currentSprint.id === updatedSprint.id) {
					currentSprint = updatedSprint;
					currentSprintName.textContent = updatedSprint.name;
				}
				
				renameSprintModal.style.display = 'none';
			} catch (error) {
				alert('Failed to rename sprint: ' + error.message);
			}
		});
	}
	
	// Set current sprint being renamed
	window.currentRenamingSprint = sprint;
	
	// Set current value in the input
	document.getElementById('newSprintName').value = sprint.name;
	
	// Show the modal
	renameSprintModal.style.display = 'flex';
};

// Handle sprint deletion
const deleteSprint = async (sprint) => {
	if (!confirm('Are you sure you want to delete this sprint?')) return;
	
	try {
		await client.deleteSprint(sprint.id);
		
		// Remove sprint from the sprints array
		sprints = sprints.filter(s => s.id !== sprint.id);
		renderSprints();
		
		// If the deleted sprint was the current one, clear the chat view
		if (currentSprint && currentSprint.id === sprint.id) {
			currentSprint = null;
			chatMessages.innerHTML = '';
			currentSprintName.textContent = '';
			client.disconnectWebSocket();
			
			// Select another sprint if available
			if (sprints.length > 0) {
				selectSprint(sprints[0]);
			}
		}
	} catch (error) {
		alert('Failed to delete sprint: ' + error.message);
	}
};

// Load user stories for a sprint or epic
const loadUserStories = async (sprint) => {
	try {
		// Check if sprint has epicId before trying to load user stories
		if (sprint.epicId) {
			const fetchedUserStories = await client.getAllUserStoriesByEpicId(sprint.epicId);
			userStories = fetchedUserStories;
			renderUserStories();
		} else {
			// If no epicId, just show empty state
			userStories = [];
			renderUserStories();
		}
	} catch (error) {
		console.error('Failed to load user stories', error);
		userStories = [];
		renderUserStories();
	}
};

// Render user stories in sidebar
const renderUserStories = () => {
	userStoriesList.innerHTML = '';

	if (userStories.length === 0) {
		const emptyState = document.createElement('div');
		emptyState.className = 'empty-state';
		emptyState.textContent = 'No user stories yet';
		
		// Add button to create user story if we have an epic
		if (currentSprint && currentSprint.epicId) {
			const createButton = document.createElement('button');
			createButton.className = 'add-item-button';
			createButton.innerHTML = '<i class="fas fa-plus"></i> Add User Story';
			createButton.addEventListener('click', () => showCreateUserStoryModal(currentSprint.epicId));
			emptyState.appendChild(createButton);
		}
		
		userStoriesList.appendChild(emptyState);
		return;
	}

	userStories.forEach(userStory => {
		const userStoryItem = document.createElement('div');
		userStoryItem.className = 'channel-item';
		userStoryItem.innerHTML = `<i class="fas fa-list"></i> <span>${userStory.name}</span>`;
		
		// Add click handler to select user story and load its tasks
		userStoryItem.addEventListener('click', () => {
			selectUserStory(userStory);
		});
		
		// Add context menu for user story
		userStoryItem.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			
			const contextMenu = document.createElement('div');
			contextMenu.className = 'context-menu';
			contextMenu.style.position = 'absolute';
			contextMenu.style.left = event.clientX + 'px';
			contextMenu.style.top = event.clientY + 'px';
			contextMenu.innerHTML = `
				<div class="context-menu-item" id="editUserStory">Edit</div>
				<div class="context-menu-item" id="deleteUserStory">Delete</div>
				<div class="context-menu-item" id="addTask">Add Task</div>
			`;
			document.body.appendChild(contextMenu);
			
			// Event listeners for context menu items
			document.getElementById('editUserStory').addEventListener('click', () => {
				showEditUserStoryModal(userStory);
				contextMenu.remove();
			});
			document.getElementById('deleteUserStory').addEventListener('click', () => {
				deleteUserStory(userStory);
				contextMenu.remove();
			});
			document.getElementById('addTask').addEventListener('click', () => {
				showCreateTaskModal(userStory.id);
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
		
		userStoriesList.appendChild(userStoryItem);
	});
	
	// Add a button to create a new user story
	if (currentSprint && currentSprint.epicId) {
		const addUserStoryButton = document.createElement('div');
		addUserStoryButton.className = 'add-item-button';
		addUserStoryButton.innerHTML = '<i class="fas fa-plus"></i> Add User Story';
		addUserStoryButton.addEventListener('click', () => showCreateUserStoryModal(currentSprint.epicId));
		userStoriesList.appendChild(addUserStoryButton);
	}
};

// Select a user story and load its tasks
const selectUserStory = async (userStory) => {
	// Update UI to show this user story is selected
	document.querySelectorAll('.channel-item').forEach(item => {
		item.classList.remove('active');
		if (item.querySelector('span').textContent === userStory.name) {
			item.classList.add('active');
		}
	});
	
	// Load tasks for this user story
	await loadTasks(userStory.id);
};

// Load tasks for a user story
const loadTasks = async (userStoryId) => {
	try {
		const fetchedTasks = await client.getAllTasksByUserStoryId(userStoryId);
		tasks = fetchedTasks;
		renderTasks();
	} catch (error) {
		console.error('Failed to load tasks', error);
		tasks = [];
		renderTasks();
	}
};

// Render tasks in sidebar
const renderTasks = () => {
	tasksList.innerHTML = '';
	
	if (tasks.length === 0) {
		const emptyState = document.createElement('div');
		emptyState.className = 'empty-state';
		emptyState.textContent = 'No tasks yet';
		
		// Add button to create task if we have a selected user story
		if (userStories.length > 0) {
			const createButton = document.createElement('button');
			createButton.className = 'add-item-button';
			createButton.innerHTML = '<i class="fas fa-plus"></i> Add Task';
			createButton.addEventListener('click', () => {
				// Find the active user story
				const activeUserStoryItem = document.querySelector('.channel-item.active');
				if (activeUserStoryItem) {
					const userStoryName = activeUserStoryItem.querySelector('span').textContent;
					const userStory = userStories.find(us => us.name === userStoryName);
					if (userStory) {
						showCreateTaskModal(userStory.id);
					}
				}
			});
			emptyState.appendChild(createButton);
		}
		
		tasksList.appendChild(emptyState);
		return;
	}
	
	tasks.forEach(task => {
		const taskItem = document.createElement('div');
		taskItem.className = 'channel-item';
		
		// Add status indicator
		let statusIcon = 'fa-circle';
		let statusClass = '';
		
		if (task.status === 'TODO') {
			statusClass = 'status-todo';
		} else if (task.status === 'IN_PROGRESS') {
			statusClass = 'status-in-progress';
		} else if (task.status === 'DONE') {
			statusClass = 'status-done';
		}
		
		taskItem.innerHTML = `
			<i class="fas fa-tasks"></i>
			<span>${task.name}</span>
			<span class="task-status ${statusClass}"><i class="fas ${statusIcon}"></i></span>
		`;
		
		// Add context menu for task
		taskItem.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			
			const contextMenu = document.createElement('div');
			contextMenu.className = 'context-menu';
			contextMenu.style.position = 'absolute';
			contextMenu.style.left = event.clientX + 'px';
			contextMenu.style.top = event.clientY + 'px';
			contextMenu.innerHTML = `
				<div class="context-menu-item" id="editTask">Edit</div>
				<div class="context-menu-item" id="deleteTask">Delete</div>
				<div class="context-menu-header">Change Status</div>
				<div class="context-menu-item" id="setStatusTodo">To Do</div>
				<div class="context-menu-item" id="setStatusInProgress">In Progress</div>
				<div class="context-menu-item" id="setStatusDone">Done</div>
			`;
			document.body.appendChild(contextMenu);
			
			// Event listeners for context menu items
			document.getElementById('editTask').addEventListener('click', () => {
				showEditTaskModal(task);
				contextMenu.remove();
			});
			document.getElementById('deleteTask').addEventListener('click', () => {
				deleteTask(task);
				contextMenu.remove();
			});
			document.getElementById('setStatusTodo').addEventListener('click', () => {
				updateTaskStatus(task, 'TODO');
				contextMenu.remove();
			});
			document.getElementById('setStatusInProgress').addEventListener('click', () => {
				updateTaskStatus(task, 'IN_PROGRESS');
				contextMenu.remove();
			});
			document.getElementById('setStatusDone').addEventListener('click', () => {
				updateTaskStatus(task, 'DONE');
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
		
		tasksList.appendChild(taskItem);
	});
	
	// Add a button to create a new task
	if (userStories.length > 0) {
		const addTaskButton = document.createElement('div');
		addTaskButton.className = 'add-item-button';
		addTaskButton.innerHTML = '<i class="fas fa-plus"></i> Add Task';
		addTaskButton.addEventListener('click', () => {
			// Find the active user story
			const activeUserStoryItem = document.querySelector('.channel-item.active');
			if (activeUserStoryItem) {
				const userStoryName = activeUserStoryItem.querySelector('span').textContent;
				const userStory = userStories.find(us => us.name === userStoryName);
				if (userStory) {
					showCreateTaskModal(userStory.id);
				}
			}
		});
		tasksList.appendChild(addTaskButton);
	}
};

// Show create user story modal
const showCreateUserStoryModal = (epicId) => {
	// Clear form fields
	document.getElementById('userStoryName').value = '';
	document.getElementById('userStoryDescription').value = '';
	
	// Store the epic ID for form submission
	createUserStoryModal.dataset.epicId = epicId;
	
	// Show the modal
	createUserStoryModal.style.display = 'flex';
};

// Show edit user story modal
const showEditUserStoryModal = (userStory) => {
	// Create modal if it doesn't exist
	let editUserStoryModal = document.getElementById('editUserStoryModal');
	if (!editUserStoryModal) {
		editUserStoryModal = document.createElement('div');
		editUserStoryModal.id = 'editUserStoryModal';
		editUserStoryModal.className = 'modal';
		editUserStoryModal.innerHTML = `
			<div class="modal-content">
				<div class="modal-header">
					<h2>Edit User Story</h2>
					<span class="close-modal">&times;</span>
				</div>
				<div class="modal-body">
					<form id="editUserStoryForm">
						<div class="form-group">
							<label for="editUserStoryName">USER STORY NAME</label>
							<input type="text" id="editUserStoryName" required>
						</div>
						<div class="form-group">
							<label for="editUserStoryDescription">USER STORY DESCRIPTION</label>
							<textarea id="editUserStoryDescription"></textarea>
						</div>
						<div class="form-group">
							<label for="editUserStoryStatus">STATUS</label>
							<select id="editUserStoryStatus">
								<option value="TODO">To Do</option>
								<option value="IN_PROGRESS">In Progress</option>
								<option value="DONE">Done</option>
							</select>
						</div>
						<button type="submit" class="modal-button">Update User Story</button>
					</form>
				</div>
			</div>
		`;
		document.body.appendChild(editUserStoryModal);
		
		// Add close button functionality
		editUserStoryModal.querySelector('.close-modal').addEventListener('click', () => {
			editUserStoryModal.style.display = 'none';
		});
		
		// Add form submission handler
		document.getElementById('editUserStoryForm').addEventListener('submit', async (e) => {
			e.preventDefault();
			
			const userStoryId = editUserStoryModal.dataset.userStoryId;
			const name = document.getElementById('editUserStoryName').value;
			const description = document.getElementById('editUserStoryDescription').value;
			const status = document.getElementById('editUserStoryStatus').value;
			
			try {
				const updatedUserStory = await client.updateUserStory(userStoryId, {
					name,
					description,
					status
				});
				
				// Update user story in the userStories array
				userStories = userStories.map(us => us.id === updatedUserStory.id ? updatedUserStory : us);
				renderUserStories();
				
				editUserStoryModal.style.display = 'none';
			} catch (error) {
				alert('Failed to update user story: ' + error.message);
			}
		});
	}
	
	// Set current values in the form
	document.getElementById('editUserStoryName').value = userStory.name;
	document.getElementById('editUserStoryDescription').value = userStory.description || '';
	document.getElementById('editUserStoryStatus').value = userStory.status || 'TODO';
	
	// Store the user story ID for form submission
	editUserStoryModal.dataset.userStoryId = userStory.id;
	
	// Show the modal
	editUserStoryModal.style.display = 'flex';
};

// Delete user story
const deleteUserStory = async (userStory) => {
	if (!confirm('Are you sure you want to delete this user story? This will also delete all associated tasks.')) return;
	
	try {
		await client.deleteUserStory(userStory.id);
		
		// Remove user story from the userStories array
		userStories = userStories.filter(us => us.id !== userStory.id);
		renderUserStories();
		
		// Clear tasks if the deleted user story was selected
		tasks = [];
		renderTasks();
	} catch (error) {
		alert('Failed to delete user story: ' + error.message);
	}
};

// Show create task modal
const showCreateTaskModal = (userStoryId) => {
	// Clear form fields
	document.getElementById('taskName').value = '';
	document.getElementById('taskDescription').value = '';
	
	// Store the user story ID for form submission
	createTaskModal.dataset.userStoryId = userStoryId;
	
	// Show the modal
	createTaskModal.style.display = 'flex';
};

// Show edit task modal
const showEditTaskModal = (task) => {
	// Create modal if it doesn't exist
	let editTaskModal = document.getElementById('editTaskModal');
	if (!editTaskModal) {
		editTaskModal = document.createElement('div');
		editTaskModal.id = 'editTaskModal';
		editTaskModal.className = 'modal';
		editTaskModal.innerHTML = `
			<div class="modal-content">
				<div class="modal-header">
					<h2>Edit Task</h2>
					<span class="close-modal">&times;</span>
				</div>
				<div class="modal-body">
					<form id="editTaskForm">
						<div class="form-group">
							<label for="editTaskName">TASK NAME</label>
							<input type="text" id="editTaskName" required>
						</div>
						<div class="form-group">
							<label for="editTaskDescription">TASK DESCRIPTION</label>
							<textarea id="editTaskDescription"></textarea>
						</div>
						<div class="form-group">
							<label for="editTaskStatus">STATUS</label>
							<select id="editTaskStatus">
								<option value="TODO">To Do</option>
								<option value="IN_PROGRESS">In Progress</option>
								<option value="DONE">Done</option>
							</select>
						</div>
						<button type="submit" class="modal-button">Update Task</button>
					</form>
				</div>
			</div>
		`;
		document.body.appendChild(editTaskModal);
		
		// Add close button functionality
		editTaskModal.querySelector('.close-modal').addEventListener('click', () => {
			editTaskModal.style.display = 'none';
		});
		
		// Add form submission handler
		document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
			e.preventDefault();
			
			const taskId = editTaskModal.dataset.taskId;
			const name = document.getElementById('editTaskName').value;
			const description = document.getElementById('editTaskDescription').value;
			const status = document.getElementById('editTaskStatus').value;
			
			try {
				const updatedTask = await client.updateTask(taskId, {
					name,
					description,
					status
				});
				
				// Update task in the tasks array
				tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
				renderTasks();
				
				editTaskModal.style.display = 'none';
			} catch (error) {
				alert('Failed to update task: ' + error.message);
			}
		});
	}
	
	// Set current values in the form
	document.getElementById('editTaskName').value = task.name;
	document.getElementById('editTaskDescription').value = task.description || '';
	document.getElementById('editTaskStatus').value = task.status || 'TODO';
	
	// Store the task ID for form submission
	editTaskModal.dataset.taskId = task.id;
	
	// Show the modal
	editTaskModal.style.display = 'flex';
};

// Delete task
const deleteTask = async (task) => {
	if (!confirm('Are you sure you want to delete this task?')) return;
	
	try {
		await client.deleteTask(task.id);
		
		// Remove task from the tasks array
		tasks = tasks.filter(t => t.id !== task.id);
		renderTasks();
	} catch (error) {
		alert('Failed to delete task: ' + error.message);
	}
};

// Update task status
const updateTaskStatus = async (task, newStatus) => {
	try {
		const updatedTask = await client.updateTask(task.id, {
			...task,
			status: newStatus
		});
		
		// Update task in the tasks array
		tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
		renderTasks();
	} catch (error) {
		alert('Failed to update task status: ' + error.message);
	}
};

// Handle user story creation
createUserStoryForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	
	const epicId = createUserStoryModal.dataset.epicId;
	const name = document.getElementById('userStoryName').value;
	const description = document.getElementById('userStoryDescription').value;
	
	try {
		const userStory = await client.createUserStory(epicId, {
			name,
			description,
			status: 'TODO' // Default status
		});
		
		// Add the new user story to the userStories array
		userStories.push(userStory);
		renderUserStories();
		
		// Close the modal and clear the form
		createUserStoryModal.style.display = 'none';
		document.getElementById('userStoryName').value = '';
		document.getElementById('userStoryDescription').value = '';
	} catch (error) {
		alert('Failed to create user story: ' + error.message);
	}
});

// Handle task creation
createTaskForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	
	const userStoryId = createTaskModal.dataset.userStoryId;
	const name = document.getElementById('taskName').value;
	const description = document.getElementById('taskDescription').value;
	
	try {
		const task = await client.createTask(userStoryId, {
			name,
			description,
			status: 'TODO' // Default status
		});
		
		// Add the new task to the tasks array
		tasks.push(task);
		renderTasks();
		
		// Close the modal and clear the form
		createTaskModal.style.display = 'none';
		document.getElementById('taskName').value = '';
		document.getElementById('taskDescription').value = '';
	} catch (error) {
		alert('Failed to create task: ' + error.message);
	}
});

// Home icon click handler - show home view
homeIcon.addEventListener('click', () => {
	showHomeView();
});

// Home create team button click handler
homeCreateTeamBtn.addEventListener('click', () => {
	createTeamModal.style.display = 'flex';
});

// Initialize the app
init();