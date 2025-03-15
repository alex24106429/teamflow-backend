import { client } from '../services/apiClient.js';
import { currentSprint } from '../state/sprintState.js';
import { currentUser } from '../state/userState.js';
import { loadMessages, sendMessage, connectToMessageWebSocket, disconnectFromMessageWebSocket } from '../services/messageService.js';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const chatHeader = document.getElementById('chatHeader');

// Current chat context
let currentChatContext = {
    id: null,
    type: null,
    name: null
};

// Display a chat message
export const displayMessage = (message) => {
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

// Send message function
export const sendChatMessage = () => {
    if (!currentChatContext.id) return;
    const content = messageInput.value.trim();
    if (!content) return;
    
    sendMessage(currentChatContext.id, currentChatContext.type, content);
    messageInput.value = '';
};

// Update chat header
const updateChatHeader = () => {
    if (!currentChatContext.id) return;
    
    let icon = 'hashtag';
    switch (currentChatContext.type) {
        case 'EPIC':
            icon = 'bookmark';
            break;
        case 'SPRINT':
            icon = 'running';
            break;
        case 'USER_STORY':
            icon = 'book';
            break;
        case 'TASK':
            icon = 'tasks';
            break;
    }
    
    document.getElementById('currentSprintName').textContent = currentChatContext.name;
    document.querySelector('.chat-header-left i').className = `fas fa-${icon}`;
};

// Load chat history for any context
export const loadChatHistory = async (contextId, contextType, contextName) => {
    if (!contextId) return;
    
    // Disconnect from previous WebSocket if any
    disconnectFromMessageWebSocket();
    
    // Update current context
    currentChatContext = {
        id: contextId,
        type: contextType,
        name: contextName
    };
    
    // Update chat header
    updateChatHeader();
    
    // Clear previous messages
    chatMessages.innerHTML = '';
    
    try {
        // Load historical messages
        const messages = await loadMessages(contextId, contextType);
        messages.forEach(message => displayMessage(message));
        
        // Connect to WebSocket for real-time updates
        connectToMessageWebSocket(contextId, contextType);
        
        // Update welcome message
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <h2>Welcome to ${contextName} Chat!</h2>
            <p>This is the beginning of your ${contextType.toLowerCase()} discussion.</p>
        `;
        
        if (chatMessages.children.length === 0) {
            chatMessages.appendChild(welcomeMessage);
        }
    } catch (error) {
        console.error(`Failed to load ${contextType} messages:`, error);
        chatMessages.innerHTML = `
            <div class="error-message">
                Failed to load messages: ${error.message}
            </div>
        `;
    }
};

// Load sprint chat (backward compatibility)
export const loadSprintChat = async () => {
    if (!currentSprint) return;
    await loadChatHistory(currentSprint.id, 'SPRINT', currentSprint.name);
};

// Initialize event listeners
export const initChatView = () => {
    // Set up message input event listener
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
};