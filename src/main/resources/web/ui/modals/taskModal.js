import { client } from '../../services/apiClient.js';
import { addTask, updateTask } from '../../state/taskState.js';
import { renderTasks } from '../taskView.js';

// DOM Elements
const createTaskModal = document.getElementById('createTaskModal');
const createTaskForm = document.getElementById('createTaskForm');

// Initialize task modal
export const initTaskModal = () => {
    // Handle task creation
    createTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userStoryId = createTaskModal.dataset.userStoryId;
        const name = document.getElementById('taskName').value;
        const description = document.getElementById('taskDescription').value;
        
        try {
            const task = await client.createTask(userStoryId, {
                name,
                description,
                status: 'TODO' // Default status
            });
            
            // Add the new task to the tasks array
            addTask(task);
            renderTasks();
            
            // Close the modal and clear the form
            createTaskModal.style.display = 'none';
            document.getElementById('taskName').value = '';
            document.getElementById('taskDescription').value = '';
        } catch (error) {
            alert('Failed to create task: ' + error.message);
        }
    });
};

// Show create task modal
export const showCreateTaskModal = (userStoryId) => {
    // Clear form fields
    document.getElementById('taskName').value = '';
    document.getElementById('taskDescription').value = '';
    
    // Store the user story ID for form submission
    createTaskModal.dataset.userStoryId = userStoryId;
    
    // Show the modal
    createTaskModal.style.display = 'flex';
};

// Show edit task modal
export const showEditTaskModal = (task) => {
    // Create modal if it doesn't exist
    let editTaskModal = document.getElementById('editTaskModal');
    if (!editTaskModal) {
        editTaskModal = document.createElement('div');
        editTaskModal.id = 'editTaskModal';
        editTaskModal.className = 'modal';
        editTaskModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Task</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editTaskForm">
                        <div class="form-group">
                            <label for="editTaskName">TASK NAME</label>
                            <input type="text" id="editTaskName" required>
                        </div>
                        <div class="form-group">
                            <label for="editTaskDescription">TASK DESCRIPTION</label>
                            <textarea id="editTaskDescription"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="editTaskStatus">STATUS</label>
                            <select id="editTaskStatus">
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                        <button type="submit" class="modal-button">Update Task</button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(editTaskModal);
        
        // Add close button functionality
        editTaskModal.querySelector('.close-modal').addEventListener('click', () => {
            editTaskModal.style.display = 'none';
        });
        
        // Add form submission handler
        document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const taskId = editTaskModal.dataset.taskId;
            const name = document.getElementById('editTaskName').value;
            const description = document.getElementById('editTaskDescription').value;
            const status = document.getElementById('editTaskStatus').value;
            
            try {
                const updatedTask = await client.updateTask(taskId, {
                    name,
                    description,
                    status
                });
                
                // Update task in the tasks array
                updateTask(updatedTask);
                renderTasks();
                editTaskModal.style.display = 'none';
            } catch (error) {
                alert('Failed to update task: ' + error.message);
            }
        });
    }
    
    // Set current values in the form
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskStatus').value = task.status || 'TODO';
    
    // Store the task ID for form submission
    editTaskModal.dataset.taskId = task.id;
    
    // Show the modal
    editTaskModal.style.display = 'flex';
};