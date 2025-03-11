class ScrumChatClient {
	constructor(baseURL = location.origin) {
		this.baseURL = baseURL;
		this.token = localStorage.getItem('scrumchat_token') || null;
		this.stompClient = null;
	}

	// ==================== Authentication ====================
	async login(username, password) {
		const response = await fetch(`${this.baseURL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (!response.ok) throw new Error('Login failed');

		const token = await response.text();
		this.token = token;
		localStorage.setItem('scrumchat_token', token);
		console.log('Login successful, token stored:', token);
		return token;
	}

	async register(username, password) {
		const response = await fetch(`${this.baseURL}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (!response.ok) throw new Error('Registration failed');

		const token = await response.text();
		this.token = token;
		localStorage.setItem('scrumchat_token', token);
		console.log('Registration successful, token stored:', token);
		return token;
	}

	// ==================== Team Management ====================
	async createTeam(name) {
		return this._authenticatedFetch('/teams', {
			method: 'POST',
			body: JSON.stringify({ name })
		});
	}

	async getTeam(teamId) {
		return this._authenticatedFetch(`/teams/${teamId}`);
	}

	async getAllTeams() {
		return this._authenticatedFetch('/teams');
	}

	// ==================== Sprint Management ====================
	async startSprint(teamId, name) {
		console.log('Starting sprint with teamId:', teamId);
		return this._authenticatedFetch(`/sprints/start?teamId=${teamId}&name=${name}`, {
			method: 'POST',
		});
	}

	async stopSprint(sprintId) {
		return this._authenticatedFetch(`/sprints/${sprintId}/stop`, {
			method: 'POST'
		});
	}

	async getSprintsByTeamId(teamId) {
		return this._authenticatedFetch(`/sprints/teams/${teamId}/sprints`);
	}

	async getMessages(sprintId) {
		const response = await fetch(`/api/sprints/${sprintId}/messages`);
		return response.json();
	}

	// ==================== WebSocket Messaging ====================
	connectWebSocket(sprintId, messageCallback) {
		console.log('WebSocket token:', this.token);
		const socket = new SockJS(`${this.baseURL}/chat`);
		const client = StompJs.Stomp.over(socket)

		client.configure({
			connectHeaders: { 'Authorization': `Bearer ${this.token}` },
			debug: (str) => console.log(str),
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		client.onConnect = (frame) => {
			client.subscribe(`/topic/chat/${sprintId}`, messageCallback);
		};

		client.onStompError = (frame) => {
			console.error('Broker reported error: ' + frame.headers['message']);
			console.error('Additional details: ' + frame.body);
		};

		client.onWebSocketClose = () => {
			console.log('WebSocket closed');
		}

		this.stompClient = client;
		client.activate();
	}

	sendMessage(sprintId, content) {
		if (!this.stompClient) throw new Error('WebSocket not connected');
		this.stompClient.publish({
			destination: `/app/chat/${sprintId}`,
			body: JSON.stringify({ content })
		});
	}

	disconnectWebSocket() {
		if (this.stompClient) {
			this.stompClient.deactivate();
			this.stompClient = null;
		}
	}

	// ==================== Helper Methods ====================
	async _authenticatedFetch(endpoint, options = {}) {
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${this.token}`
		};

		const response = await fetch(`${this.baseURL}${endpoint}`, {
			...options,
			headers: { ...headers, ...options.headers }
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(error);
		}

		return response.json();
	}

	logout() {
		this.token = null;
		localStorage.removeItem('scrumchat_token');
		this.disconnectWebSocket();
	}
}

const client = new ScrumChatClient();

// // Login
// await client.login('username', 'password');

// // Create team
// const team = await client.createTeam({name: 'Dev Team'});

// // Start sprint
// // const sprint = await client.startSprint(team.id);

// // Connect to chat
// client.connectWebSocket(sprint.id, (message) => {
//   console.log('New message:', JSON.parse(message.body));
// });

// // Send message
// client.sendMessage(sprint.id, 'Hello team!');
