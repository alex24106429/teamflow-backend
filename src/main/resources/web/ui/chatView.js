import { client } from '../services/apiClient.js';
import { currentSprint } from '../state/sprintState.js';
import { currentUser } from '../state/userState.js';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');

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
export const sendMessage = () => {
    if (!currentSprint) return;
    const content = messageInput.value.trim();
    if (!content) return;
    
    client.sendMessage(currentSprint.id, content);
    messageInput.value = '';
};

// Load chat history
export const loadChatHistory = async () => {
    if (!currentSprint) return;
    
    chatMessages.innerHTML = '';
    
    try {
        // Load historical messages
        const messages = await client.getMessages(currentSprint.id);
        messages.forEach(message => displayMessage(message));
        
        // Connect to WebSocket for real-time updates
        client.connectWebSocket(currentSprint.id, (message) => {
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
};