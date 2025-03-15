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
            const startDateInput = document.getElementById('sprintStartDate').value;
            const endDateInput = document.getElementById('sprintEndDate').value;
            
            const startDate = startDateInput ? new Date(startDateInput) : new Date();
            const endDate = endDateInput ? new Date(endDateInput) : null;
            
            const sprint = await client.startSprint(currentTeam.id, sprintName, startDate, endDate);
            addSprint(sprint);
            renderSprints();
            selectSprint(sprint);
            startSprintModal.style.display = 'none';
            
            // Clear the inputs
            document.getElementById('sprintName').value = '';
            document.getElementById('sprintStartDate').value = '';
            document.getElementById('sprintEndDate').value = '';
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

// Show edit sprint modal
export const showEditSprintModal = (sprint) => {
    // Create modal if it doesn't exist
    let renameSprintModal = document.getElementById('editSprintModal');
    if (!renameSprintModal) {
        renameSprintModal = document.createElement('div');
        renameSprintModal.id = 'editSprintModal';
        renameSprintModal.className = 'modal';
        renameSprintModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Sprint</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editSprintForm">
                        <div class="form-group">
                            <label for="newSprintName">Sprint Name</label>
                            <input type="text" id="newSprintName" required>
                        </div>
                        <div class="form-group">
                            <label for="newSprintStartDate">Start Date</label>
                            <input type="datetime-local" id="newSprintStartDate">
                        </div>
                        <div class="form-group">
                            <label for="newSprintEndDate">End Date</label>
                            <input type="datetime-local" id="newSprintEndDate">
                        </div>
                        <button type="submit" class="modal-button">Update Sprint</button>
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
        document.getElementById('editSprintForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = document.getElementById('newSprintName').value;
            if (!newName) return;
            
            try {
                // First update the name
                const updatedSprint = await client.updateSprint(window.currentRenamingSprint.id, newName);
                
                // Then update the dates if provided
                const startDateInput = document.getElementById('newSprintStartDate').value;
                const endDateInput = document.getElementById('newSprintEndDate').value;
                
                if (startDateInput || endDateInput) {
                    const startDate = startDateInput ? new Date(startDateInput) : null;
                    const endDate = endDateInput ? new Date(endDateInput) : null;
                    
                    // Update dates using the new endpoint
                    const sprintWithDates = await client.updateSprintDates(
                        window.currentRenamingSprint.id,
                        startDate,
                        endDate
                    );
                    
                    // Merge the updated sprint with the dates
                    Object.assign(updatedSprint, sprintWithDates);
                }
                
                // Update sprint in the sprints array
                import('../../services/sprintService.js').then(module => {
                    module.updateSprintState(updatedSprint);
                });
                
                renameSprintModal.style.display = 'none';
            } catch (error) {
                alert('Failed to update sprint: ' + error.message);
            }
        });
    }
    
    // Set current sprint being renamed
    window.currentRenamingSprint = sprint;
    
    // Set current values in the inputs
    document.getElementById('newSprintName').value = sprint.name;
    
    // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
    if (sprint.startDate) {
        const startDate = new Date(sprint.startDate);
        const formattedStartDate = startDate.toISOString().slice(0, 16);
        document.getElementById('newSprintStartDate').value = formattedStartDate;
    }
    
    if (sprint.endDate) {
        const endDate = new Date(sprint.endDate);
        const formattedEndDate = endDate.toISOString().slice(0, 16);
        document.getElementById('newSprintEndDate').value = formattedEndDate;
    }
    
    // Show the modal
    renameSprintModal.style.display = 'flex';
};