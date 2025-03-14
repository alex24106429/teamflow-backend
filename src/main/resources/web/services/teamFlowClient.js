export class TeamFlowClient {
    constructor(baseURL = location.origin) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('teamflow_token') || null;
        this.stompClient = null;
    }
    
    // ==================== Authentication ====================
    async login(username, password) {
        const response = await fetch(`${this.baseURL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
        
        const data = await response.json();
        this.token = data.token;
        localStorage.setItem('teamflow_token', data.token);
        console.log('Login successful, token stored');
        return data;
    }
    
    async register(username, password) {
        const response = await fetch(`${this.baseURL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        
        const data = await response.json();
        this.token = data.token;
        localStorage.setItem('teamflow_token', data.token);
        console.log('Registration successful, token stored');
        return data;
    }
    
    logout() {
        this.token = null;
        localStorage.removeItem('teamflow_token');
        this.disconnectWebSocket();
    }
    
    // ==================== Team Management ====================
    async createTeam(name) {
        return this._authenticatedFetch('/api/teams', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
    }
    
    async getTeam(teamId) {
        return this._authenticatedFetch(`/api/teams/${teamId}`);
    }
    
    async getAllTeams() {
        return this._authenticatedFetch('/api/teams');
    }
    
    // ==================== Sprint Management ====================
    async startSprint(teamId, name, startDate = new Date(), endDate = null) {
        return this._authenticatedFetch(`/api/sprints/start`, {
            method: 'POST',
            body: JSON.stringify({
                teamId: teamId,
                name: name,
                startDate: startDate.toISOString(),
                endDate: endDate?.toISOString()
            })
        });
    }
    
    async stopSprint(sprintId) {
        return this._authenticatedFetch(`/api/sprints/${sprintId}/stop`, {
            method: 'POST'
        });
    }
    
    async updateSprint(sprintId, name) {
        return this._authenticatedFetch(`/api/sprints/${sprintId}`, {
            method: 'PUT',
            body: JSON.stringify({ name })
        });
    }
    
    async deleteSprint(sprintId) {
        return this._authenticatedFetch(`/api/sprints/${sprintId}`, {
            method: 'DELETE'
        });
    }
    
    async getSprintsByTeamId(teamId) {
        return this._authenticatedFetch(`/api/sprints/teams/${teamId}/sprints`);
    }
    
    async getMessages(sprintId) {
        return this._authenticatedFetch(`/api/sprints/${sprintId}/messages`);
    }
    
    // ==================== Epic Management ====================
    async createEpic(teamId, epic) {
        return this._authenticatedFetch(`/api/epics?teamId=${teamId}`, {
            method: 'POST',
            body: JSON.stringify(epic)
        });
    }
    
    async getEpicById(epicId) {
        return this._authenticatedFetch(`/api/epics/${epicId}`);
    }
    
    async getAllEpicsByTeamId(teamId) {
        return this._authenticatedFetch(`/api/epics?teamId=${teamId}`);
    }
    
    async updateEpic(epicId, epic) {
        return this._authenticatedFetch(`/api/epics/${epicId}`, {
            method: 'PUT',
            body: JSON.stringify(epic)
        });
    }
    
    async deleteEpic(epicId) {
        return this._authenticatedFetch(`/api/epics/${epicId}`, {
            method: 'DELETE'
        });
    }
    
    // ==================== User Story Management ====================
    async createUserStory(epicId, userStory) {
        return this._authenticatedFetch(`/api/user-stories?epicId=${epicId}`, {
            method: 'POST',
            body: JSON.stringify(userStory)
        });
    }
    
    async getUserStoryById(userStoryId) {
        return this._authenticatedFetch(`/api/user-stories/${userStoryId}`);
    }
    
    async getAllUserStoriesByEpicId(epicId) {
        return this._authenticatedFetch(`/api/user-stories?epicId=${epicId}`);
    }
    
    async updateUserStory(userStoryId, userStory) {
        return this._authenticatedFetch(`/api/user-stories/${userStoryId}`, {
            method: 'PUT',
            body: JSON.stringify(userStory)
        });
    }
    
    async deleteUserStory(userStoryId) {
        return this._authenticatedFetch(`/api/user-stories/${userStoryId}`, {
            method: 'DELETE'
        });
    }
    
    // ==================== Task Management ====================
    async createTask(userStoryId, task) {
        return this._authenticatedFetch(`/api/tasks?userStoryId=${userStoryId}`, {
            method: 'POST',
            body: JSON.stringify(task)
        });
    }
    
    async getTaskById(taskId) {
        return this._authenticatedFetch(`/api/tasks/${taskId}`);
    }
    
    async getAllTasksByUserStoryId(userStoryId) {
        return this._authenticatedFetch(`/api/tasks?userStoryId=${userStoryId}`);
    }
    
    async updateTask(taskId, task) {
        return this._authenticatedFetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(task)
        });
    }
    
    async deleteTask(taskId) {
        return this._authenticatedFetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
    }
    
    // ==================== WebSocket Messaging ====================
    connectWebSocket(sprintId, messageCallback) {
        console.log('WebSocket token:', this.token);
        const socket = new window.SockJS(`${this.baseURL}/chat`);
        // For StompJS v7, we need to use the Client class
        const client = new window.StompJs.Client({
            webSocketFactory: () => socket,
            connectHeaders: { 'Authorization': `Bearer ${this.token}` },
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: (frame) => {
                client.subscribe(`/topic/chat/${sprintId}`, messageCallback);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketClose: () => {
                console.log('WebSocket closed');
            }
        });
        
        this.stompClient = client;
        client.activate();
    }
    
    sendMessage(sprintId, content) {
        if (!this.stompClient) throw new Error('WebSocket not connected');
        this.stompClient.publish({
            destination: `/app/chat/${sprintId}`,
            body: JSON.stringify({ content }),
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
    }
    
    disconnectWebSocket() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
        }
    }
    
    // ==================== Helper Methods ====================
    formatSprintDate(dateString) {
        if (!dateString) return 'No end date';
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    async _authenticatedFetch(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
        
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers }
            });
            
            if (response.status === 401) {
                // Handle unauthorized - token might be invalid or expired
                console.error('Authentication failed. Please log in again.');
                this.logout();
                
                // Show login modal
                document.getElementById('authModal').classList.add('active');
                
                throw new Error('Authentication failed. Please log in again.');
            }
            
            if (!response.ok) {
                let errorMessage;
                try {
                    // Try to parse as JSON first
                    const errorData = await response.json();
                    errorMessage = errorData.message || 'An error occurred';
                } catch (e) {
                    // If not JSON, get as text
                    errorMessage = await response.text();
                }
                throw new Error(errorMessage);
            }
            
            if (response.status === 204) {
                return null;
            }
            
            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
}