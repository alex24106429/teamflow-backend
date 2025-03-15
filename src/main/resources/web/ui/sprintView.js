import { sprints, currentSprint } from '../state/sprintState.js';
import { selectSprint } from '../services/sprintService.js';
import { client } from '../services/apiClient.js';

// DOM Elements
const sprintsList = document.getElementById('sprintsList');
const currentSprintName = document.getElementById('currentSprintName');

// Render sprints in sidebar
export const renderSprints = () => {
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
        
        // Format dates using the client's formatSprintDate helper
        const startDateStr = sprint.startDate ? client.formatSprintDate(sprint.startDate) : 'Not set';
        const endDateStr = sprint.endDate ? client.formatSprintDate(sprint.endDate) : 'Not set';
        
        sprintItem.innerHTML = `
            <i class="fas fa-hashtag"></i>
            <span>${sprint.name}</span>
            <div class="sprint-dates">
                <small title="Start: ${startDateStr} - End: ${endDateStr}">
                    ${sprint.startDate ? '📅' : ''}
                </small>
            </div>
        `;
        
        if (currentSprint && sprint.id === currentSprint.id) {
            sprintItem.classList.add('active');
        }
        
        sprintItem.addEventListener('click', () => {
            selectSprint(sprint);
        });
        
        // Add context menu for sprint channels
        sprintItem.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            showSprintContextMenu(event, sprint);
        });
        
        sprintsList.appendChild(sprintItem);
    });
};

// Show context menu for sprint
export const showSprintContextMenu = (event, sprint) => {
    event.preventDefault();
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = event.clientY + 'px';
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" id="editSprint">Edit Sprint</div>
        <div class="context-menu-item" id="deleteSprint">Delete</div>
    `;
    
    document.body.appendChild(contextMenu);
    
    // Import these functions dynamically to avoid circular dependencies
    import('../services/sprintService.js').then(module => {
        // Event listeners for context menu items
        document.getElementById('editSprint').addEventListener('click', () => {
            module.showEditSprintModal(sprint);
            contextMenu.remove();
        });
        
        document.getElementById('deleteSprint').addEventListener('click', () => {
            module.deleteSprint(sprint);
            contextMenu.remove();
        });
    });
    
    // Close context menu on outside click
    document.addEventListener('click', function outsideClickListener(event) {
        if (!contextMenu.contains(event.target)) {
            contextMenu.remove();
            document.removeEventListener('click', outsideClickListener);
        }
    });
};

// Update sprint header
export const updateSprintHeader = () => {
    if (currentSprint) {
        // Format dates
        const startDateStr = currentSprint.startDate ? client.formatSprintDate(currentSprint.startDate) : 'Not set';
        const endDateStr = currentSprint.endDate ? client.formatSprintDate(currentSprint.endDate) : 'Not set';
        
        // Update header with name and dates
        currentSprintName.innerHTML = `
            ${currentSprint.name}
            <span class="sprint-date-info">
                ${currentSprint.startDate ? `📅 ${startDateStr} - ${endDateStr}` : ''}
            </span>
        `;
    } else {
        currentSprintName.textContent = '';
    }
};