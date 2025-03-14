import { epics, selectedEpic } from '../state/epicState.js';
import { selectEpic } from '../services/epicService.js';

// DOM Elements
const epicsList = document.getElementById('epicsList');

// Render epics in sidebar
export const renderEpics = () => {
    epicsList.innerHTML = '';
    
    if (epics.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No epics yet';
        epicsList.appendChild(emptyState);
        return;
    }
    
    epics.forEach(epic => {
        const epicItem = document.createElement('div');
        epicItem.className = 'channel-item'; // Reusing channel-item style
        
        // Add selected-epic class if this epic is selected
        if (selectedEpic && selectedEpic.id === epic.id) {
            epicItem.classList.add('selected-epic');
        }
        
        epicItem.innerHTML = `<i class="fas fa-bookmark"></i> <span>${epic.name}</span>`; // Using bookmark icon for epics
        
        // Add click handler to select/deselect epic
        epicItem.addEventListener('click', () => {
            if (selectedEpic && selectedEpic.id === epic.id) {
                // Deselect if already selected
                selectEpic(null);
                epicItem.classList.remove('selected-epic');
            } else {
                // Select this epic
                selectEpic(epic);
            }
        });
        
        // Add context menu for edit/delete
        epicItem.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            showEpicContextMenu(event, epic);
        });
        
        epicsList.appendChild(epicItem);
    });
};

// Show context menu for epic
export const showEpicContextMenu = (event, epic) => {
    event.preventDefault();
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = event.clientY + 'px';
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" id="editEpic">Edit</div>
        <div class="context-menu-item" id="deleteEpic">Delete</div>
    `;
    
    document.body.appendChild(contextMenu);
    
    // Import these functions dynamically to avoid circular dependencies
    import('../services/epicService.js').then(module => {
        // Event listeners for context menu items
        document.getElementById('editEpic').addEventListener('click', () => {
            module.showEditEpicModal(epic);
            contextMenu.remove();
        });
        
        document.getElementById('deleteEpic').addEventListener('click', () => {
            module.deleteEpic(epic);
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