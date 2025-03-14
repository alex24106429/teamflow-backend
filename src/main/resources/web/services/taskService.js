import { client } from './apiClient.js';
import { setTasks, removeTask } from '../state/taskState.js';
import { renderTasks } from '../ui/taskView.js';

// Load tasks for a user story
export const loadTasks = async (userStoryId) => {
    try {
        const fetchedTasks = await client.getAllTasksByUserStoryId(userStoryId);
        setTasks(fetchedTasks);
        renderTasks();
    } catch (error) {
        console.error('Failed to load tasks', error);
        setTasks([]);
        renderTasks();
    }
};

// Delete task
export const deleteTask = async (task) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        await client.deleteTask(task.id);
        
        // Remove task from the tasks array
        removeTask(task.id);
        renderTasks();
    } catch (error) {
        alert('Failed to delete task: ' + error.message);
    }
};

// Update task status
export const updateTaskStatus = async (task, newStatus) => {
    try {
        const updatedTask = await client.updateTask(task.id, {
            ...task,
            status: newStatus
        });
        
        // Import and use the updateTask function from the state
        import('../state/taskState.js').then(module => {
            module.updateTask(updatedTask);
            renderTasks();
        });
    } catch (error) {
        alert('Failed to update task status: ' + error.message);
    }
};