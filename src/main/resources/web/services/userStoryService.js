import { client } from './apiClient.js';
import { setUserStories, removeUserStory } from '../state/userStoryState.js';
import { renderUserStories } from '../ui/userStoryView.js';
import { loadTasks } from './taskService.js';
import { clearTaskState } from '../state/taskState.js';
import { renderTasks } from '../ui/taskView.js';

// Load user stories for a sprint
export const loadUserStories = async (sprint) => {
    try {
        // Check if sprint has epicId before trying to load user stories
        if (sprint.epicId) {
            await loadUserStoriesForEpic(sprint.epicId);
        } else {
            // If no epicId, just show empty state
            setUserStories([]);
            renderUserStories();
        }
    } catch (error) {
        console.error('Failed to load user stories', error);
        setUserStories([]);
        renderUserStories();
    }
};

// Load user stories for an epic
export const loadUserStoriesForEpic = async (epicId) => {
    try {
        const fetchedUserStories = await client.getAllUserStoriesByEpicId(epicId);
        setUserStories(fetchedUserStories);
        renderUserStories();
    } catch (error) {
        console.error('Failed to load user stories', error);
        setUserStories([]);
        renderUserStories();
    }
};

// Select a user story and load its tasks
export const selectUserStory = async (userStory) => {
    // Update UI to show this user story is selected
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('span').textContent === userStory.name) {
            item.classList.add('active');
        }
    });
    
    // Load tasks for this user story
    await loadTasks(userStory.id);
};

// Delete user story
export const deleteUserStory = async (userStory) => {
    if (!confirm('Are you sure you want to delete this user story? This will also delete all associated tasks.')) return;
    
    try {
        await client.deleteUserStory(userStory.id);
        
        // Remove user story from the userStories array
        removeUserStory(userStory.id);
        renderUserStories();
        
        // Clear tasks
        clearTaskState();
        renderTasks();
    } catch (error) {
        alert('Failed to delete user story: ' + error.message);
    }
};