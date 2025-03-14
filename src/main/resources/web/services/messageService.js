import { client } from './apiClient.js';
import { displayMessage } from '../ui/chatView.js';

// Load messages for a sprint
export const loadMessages = async (sprintId) => {
    try {
        const messages = await client.getMessages(sprintId);
        return messages;
    } catch (error) {
        console.error('Failed to load messages:', error);
        return [];
    }
};

// Send a message
export const sendMessage = async (sprintId, content) => {
    try {
        await client.sendMessage(sprintId, content);
    } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message: ' + error.message);
    }
};

// Connect to WebSocket for real-time messages
export const connectToMessageWebSocket = (sprintId) => {
    client.connectWebSocket(sprintId, (message) => {
        displayMessage(JSON.parse(message.body));
    });
};

// Disconnect from WebSocket
export const disconnectFromMessageWebSocket = () => {
    client.disconnectWebSocket();
};