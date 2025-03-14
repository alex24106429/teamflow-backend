import { client } from '../../services/apiClient.js';
import { currentTeam } from '../../state/teamState.js';
import { addSprint } from '../../state/sprintState.js';
import { renderSprints } from '../sprintView.js';
import { selectSprint } from '../../services/sprintService.js';

// DOM Elements
const startSprintModal = document.getElementById('startSprintModal');
const startSprintForm = document.getElementById('startSprintForm');

// Initialize sprint modal
export const initSprintModal = () => {
    // Handle sprint creation form submission
    startSprintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const sprintName = document.getElementById('sprintName').value;
        if (!sprintName) return;
        
        try {
            const sprint = await client.startSprint(currentTeam.id, sprintName);
            addSprint(sprint);
            renderSprints();
            selectSprint(sprint);
            startSprintModal.style.display = 'none';
            document.getElementById('sprintName').value = ''; // Clear the input
        } catch (error) {
            alert('Failed to start sprint: ' + error.message);
        }
    });
};

// Show start sprint modal
export const showStartSprintModal = () => {
    if (!currentTeam) {
        alert('Please select a team first');
        return;
    }
    startSprintModal.style.display = 'flex';
};

// Show rename sprint modal
export const showRenameSprintModal = (sprint) => {
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
                const updatedSprint = await client.updateSprint(window.currentRenamingSprint.id, newName);
                // Update sprint in the sprints array
                import('../../services/sprintService.js').then(module => {
                    module.updateSprintState(updatedSprint);
                });
                
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