import { client } from './apiClient.js';
import { displayMessage } from '../ui/chatView.js';

// Load messages for different contexts
export const loadMessages = async (contextId, contextType) => {
    try {
        let messages = [];
        switch (contextType) {
            case 'SPRINT':
                messages = await client.getSprintMessages(contextId);
                break;
            case 'EPIC':
                messages = await client.getEpicMessages(contextId);
                break;
            case 'USER_STORY':
                messages = await client.getUserStoryMessages(contextId);
                break;
            case 'TASK':
                messages = await client.getTaskMessages(contextId);
                break;
            default:
                console.error('Invalid context type:', contextType);
        }
        return messages;
    } catch (error) {
        console.error(`Failed to load ${contextType} messages:`, error);
        return [];
    }
};

// Send a message to different contexts
export const sendMessage = async (contextId, contextType, content) => {
    try {
        switch (contextType) {
            case 'SPRINT':
                await client.sendSprintMessage(contextId, content);
                break;
            case 'EPIC':
                await client.sendEpicMessage(contextId, content);
                break;
            case 'USER_STORY':
                await client.sendUserStoryMessage(contextId, content);
                break;
            case 'TASK':
                await client.sendTaskMessage(contextId, content);
                break;
            default:
                console.error('Invalid context type:', contextType);
        }
    } catch (error) {
        console.error(`Failed to send ${contextType} message:`, error);
        alert('Failed to send message: ' + error.message);
    }
};

// Connect to WebSocket for real-time messages in different contexts
export const connectToMessageWebSocket = (contextId, contextType) => {
    switch (contextType) {
        case 'SPRINT':
            client.connectToSprintChat(contextId, (message) => {
                displayMessage(JSON.parse(message.body));
            });
            break;
        case 'EPIC':
            client.connectToEpicChat(contextId, (message) => {
                displayMessage(JSON.parse(message.body));
            });
            break;
        case 'USER_STORY':
            client.connectToUserStoryChat(contextId, (message) => {
                displayMessage(JSON.parse(message.body));
            });
            break;
        case 'TASK':
            client.connectToTaskChat(contextId, (message) => {
                displayMessage(JSON.parse(message.body));
            });
            break;
        default:
            console.error('Invalid context type:', contextType);
    }
};

// Disconnect from WebSocket
export const disconnectFromMessageWebSocket = () => {
    client.disconnectWebSocket();
};

// Backward compatibility functions
export const loadSprintMessages = async (sprintId) => {
    return loadMessages(sprintId, 'SPRINT');
};

export const sendSprintMessage = async (sprintId, content) => {
    return sendMessage(sprintId, 'SPRINT', content);
};

export const connectToSprintWebSocket = (sprintId) => {
    connectToMessageWebSocket(sprintId, 'SPRINT');
};