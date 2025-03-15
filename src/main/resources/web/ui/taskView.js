import { tasks } from '../state/taskState.js';
import { userStories } from '../state/userStoryState.js';
import { loadChatHistory } from './chatView.js';
import { showChatView } from './viewManager.js';

// DOM Elements
const tasksList = document.getElementById('tasksList');

// Render tasks in sidebar
export const renderTasks = () => {
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No tasks yet';
        
        tasksList.appendChild(emptyState);
        return;
    }
    
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'channel-item';
        
        // Add status indicator
        let statusIcon = 'fa-circle';
        let statusClass = '';
        if (task.status === 'TODO') {
            statusClass = 'status-todo';
        } else if (task.status === 'IN_PROGRESS') {
            statusClass = 'status-in-progress';
        } else if (task.status === 'DONE') {
            statusClass = 'status-done';
        }
        
        taskItem.innerHTML = `
            <i class="fas fa-tasks"></i>
            <span>${task.name}</span>
            <span class="task-status ${statusClass}"><i class="fas ${statusIcon}"></i></span>
        `;
        
        // Add click handler to open task chat
        taskItem.addEventListener('click', () => {
            showChatView();
            loadChatHistory(task.id, 'TASK', task.name);
        });
        
        // Add context menu for task
        taskItem.addEventListener('contextmenu', (event)=> {
            event.preventDefault();
            showTaskContextMenu(event, task);
        });
        
        tasksList.appendChild(taskItem);
    });
};

// Show context menu for task
export const showTaskContextMenu = (event, task) => {
    event.preventDefault();
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = event.clientY + 'px';
    
    contextMenu.innerHTML = `
        <div class="context-menu-item" id="openTaskChat">Open Chat</div>
        <div class="context-menu-item" id="editTask">Edit</div>
        <div class="context-menu-item" id="deleteTask">Delete</div>
        <div class="context-menu-header">Change Status</div>
        <div class="context-menu-item" id="setStatusTodo">To Do</div>
        <div class="context-menu-item" id="setStatusInProgress">In Progress</div>
        <div class="context-menu-item" id="setStatusDone">Done</div>
    `;
    
    document.body.appendChild(contextMenu);
    
    // Open task chat
    document.getElementById('openTaskChat').addEventListener('click', () => {
        showChatView();
        loadChatHistory(task.id, 'TASK', task.name);
        contextMenu.remove();
    });
    
    // Import these functions dynamically to avoid circular dependencies
    import('../services/taskService.js').then(module => {
        // Event listeners for context menu items
        document.getElementById('editTask').addEventListener('click', () => {
            module.showEditTaskModal(task);
            contextMenu.remove();
        });
        
        document.getElementById('deleteTask').addEventListener('click', () => {
            module.deleteTask(task);
            contextMenu.remove();
        });
        
        document.getElementById('setStatusTodo').addEventListener('click', () => {
            module.updateTaskStatus(task, 'TODO');
            contextMenu.remove();
        });
        
        document.getElementById('setStatusInProgress').addEventListener('click', () => {
            module.updateTaskStatus(task, 'IN_PROGRESS');
            contextMenu.remove();
        });
        
        document.getElementById('setStatusDone').addEventListener('click', () => {
            module.updateTaskStatus(task, 'DONE');
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