import { client } from './apiClient.js';
import { setEpics, setSelectedEpic, removeEpic, selectedEpic } from '../state/epicState.js';
import { renderEpics } from '../ui/epicView.js';
import { clearUserStoryState } from '../state/userStoryState.js';
import { clearTaskState } from '../state/taskState.js';
import { renderUserStories } from '../ui/userStoryView.js';
import { renderTasks } from '../ui/taskView.js';
import { loadUserStoriesForEpic } from './userStoryService.js';

// Load epics for a team
export const loadEpics = async (teamId) => {
    try {
        const fetchedEpics = await client.getAllEpicsByTeamId(teamId);
        setEpics(fetchedEpics);
        renderEpics();
    } catch (error) {
        console.error('Failed to load epics', error);
    }
};

// Select an epic
export const selectEpic = (epic) => {
    setSelectedEpic(epic);
    
    // Update UI to show this epic is selected
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('selected-epic');
        if (epic && item.querySelector('span').textContent === epic.name &&
            item.querySelector('i').classList.contains('fa-bookmark')) {
            item.classList.add('selected-epic');
        }
    });
    
    if (epic) {
        // Load user stories for this epic
        loadUserStoriesForEpic(epic.id);
    } else {
        // Clear user stories and tasks if deselecting
        clearUserStoryState();
        clearTaskState();
        renderUserStories();
        renderTasks();
    }
};

// Delete epic
export const deleteEpic = async (epic) => {
    if (!confirm('Are you sure you want to delete this epic?')) return;
    
    try {
        await client.deleteEpic(epic.id);
        removeEpic(epic.id);
        renderEpics();
        
        // Clear selected epic if it's the one being deleted
        if (selectedEpic && selectedEpic.id === epic.id) {
            selectEpic(null);
        }
    } catch (error) {
        alert('Failed to delete epic: ' + error.message);
    }
};