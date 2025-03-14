import { sprints, currentSprint } from '../state/sprintState.js';
import { selectSprint } from '../services/sprintService.js';

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
        sprintItem.innerHTML = `<i class="fas fa-hashtag"></i> <span>${sprint.name}</span>`;
        
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
        <div class="context-menu-item" id="renameSprint">Rename</div>
        <div class="context-menu-item" id="deleteSprint">Delete</div>
    `;
    
    document.body.appendChild(contextMenu);
    
    // Import these functions dynamically to avoid circular dependencies
    import('../services/sprintService.js').then(module => {
        // Event listeners for context menu items
        document.getElementById('renameSprint').addEventListener('click', () => {
            module.showRenameSprintModal(sprint);
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
        currentSprintName.textContent = currentSprint.name;
    } else {
        currentSprintName.textContent = '';
    }
};