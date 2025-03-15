import { client } from './apiClient.js';
import { setSprints, setCurrentSprint, sprints, currentSprint, updateSprint as updateSprintInState, removeSprint } from '../state/sprintState.js';
import { renderSprints, updateSprintHeader } from '../ui/sprintView.js';
import { loadUserStories } from './userStoryService.js';
import { loadChatHistory } from '../ui/chatView.js';
import { showEditSprintModal } from '../ui/modals/sprintModal.js';

// Re-export the modal function for use in other modules
export { showEditSprintModal };

// Load sprints for a team
export const loadSprints = async (teamId) => {
    try {
        const fetchedSprints = await client.getSprintsByTeamId(teamId);
        setSprints(fetchedSprints);
        renderSprints();
    } catch (error) {
        console.error('Failed to load sprints', error);
    }
};

// Select a sprint
export const selectSprint = async (sprint) => {
    // Disconnect from current sprint if any
    if (currentSprint) {
        client.disconnectWebSocket();
    }
    
    setCurrentSprint(sprint);
    updateSprintHeader();
    
    // Update UI to show this sprint is selected
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('span').textContent === `${sprint.name}`) {
            item.classList.add('active');
        }
    });
    
    // Load chat history and connect to WebSocket
    await loadChatHistory();
    
    // Load user stories for this sprint
    await loadUserStories(sprint);
};

// Update sprint state after rename
export const updateSprintState = (updatedSprint) => {
    updateSprintInState(updatedSprint);
    renderSprints();
    
    // Update current sprint if it's the one being renamed
    if (currentSprint && currentSprint.id === updatedSprint.id) {
        setCurrentSprint(updatedSprint);
        updateSprintHeader();
    }
};

// Delete sprint
export const deleteSprint = async (sprint) => {
    if (!confirm('Are you sure you want to delete this sprint?')) return;
    
    try {
        await client.deleteSprint(sprint.id);
        
        // Remove sprint from the sprints array
        removeSprint(sprint.id);
        renderSprints();
        
        // If the deleted sprint was the current one, clear the chat view
        if (currentSprint && currentSprint.id === sprint.id) {
            setCurrentSprint(null);
            document.getElementById('chatMessages').innerHTML = '';
            document.getElementById('currentSprintName').textContent = '';
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