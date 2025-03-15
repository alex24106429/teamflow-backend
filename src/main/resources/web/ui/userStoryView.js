import { userStories } from '../state/userStoryState.js';
import { currentSprint } from '../state/sprintState.js';
import { selectUserStory } from '../services/userStoryService.js';
import { loadChatHistory } from './chatView.js';
import { showChatView } from './viewManager.js';

// DOM Elements
const userStoriesList = document.getElementById('userStoriesList');

// Render user stories in sidebar
export const renderUserStories = () => {
    userStoriesList.innerHTML = '';
    
    if (userStories.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No user stories yet';
        
        // Add button to create user story if we have an epic
        if (currentSprint && currentSprint.epicId) {
            const createButton = document.createElement('button');
            createButton.className = 'add-item-button';
            createButton.innerHTML = '<i class="fas fa-plus"></i> Add User Story';
            
            createButton.addEventListener('click', () => {
                import('../services/userStoryService.js').then(module => {
                    module.showCreateUserStoryModal(currentSprint.epicId);
                });
            });
            
            emptyState.appendChild(createButton);
        }
        
        userStoriesList.appendChild(emptyState);
        return;
    }
    
    userStories.forEach(userStory => {
        const userStoryItem = document.createElement('div');
        userStoryItem.className = 'channel-item';
        userStoryItem.innerHTML = `<i class="fas fa-book"></i> <span>${userStory.name}</span>`;
        
        // Add click handler to open user story chat
        userStoryItem.addEventListener('click', () => {
            selectUserStory(userStory);
            showChatView();
            loadChatHistory(userStory.id, 'USER_STORY', userStory.name);
        });
        
        // Add context menu for user story
        userStoryItem.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            showUserStoryContextMenu(event, userStory);
        });
        
        userStoriesList.appendChild(userStoryItem);
    });
    
    // Add a button to create a new user story
    if (currentSprint && currentSprint.epicId) {
        const addUserStoryButton = document.createElement('div');
        addUserStoryButton.className = 'add-item-button';
        addUserStoryButton.innerHTML = '<i class="fas fa-plus"></i> Add User Story';
        
        addUserStoryButton.addEventListener('click', () => {
            import('../services/userStoryService.js').then(module => {
                module.showCreateUserStoryModal(currentSprint.epicId);
            });
        });
        
        userStoriesList.appendChild(addUserStoryButton);
    }
};

// Show context menu for user story
export const showUserStoryContextMenu = (event, userStory) => {
    event.preventDefault();
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = event.clientY + 'px';
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" id="openUserStoryChat">Open Chat</div>
        <div class="context-menu-item" id="editUserStory">Edit</div>
        <div class="context-menu-item" id="deleteUserStory">Delete</div>
        <div class="context-menu-item" id="addTask">Add Task</div>
    `;
    
    document.body.appendChild(contextMenu);
    
    // Open user story chat
    document.getElementById('openUserStoryChat').addEventListener('click', () => {
        selectUserStory(userStory);
        showChatView();
        loadChatHistory(userStory.id, 'USER_STORY', userStory.name);
        contextMenu.remove();
    });
    
    // Import these functions dynamically to avoid circular dependencies
    import('../services/userStoryService.js').then(module => {
        // Event listeners for context menu items
        document.getElementById('editUserStory').addEventListener('click', () => {
            module.showEditUserStoryModal(userStory);
            contextMenu.remove();
        });
        
        document.getElementById('deleteUserStory').addEventListener('click', () => {
            module.deleteUserStory(userStory);
            contextMenu.remove();
        });
    });
    
    import('../services/taskService.js').then(module => {
        document.getElementById('addTask').addEventListener('click', () => {
            module.showCreateTaskModal(userStory.id);
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