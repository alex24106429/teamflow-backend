import { client } from '../../services/apiClient.js';
import { currentTeam } from '../../state/teamState.js';
import { addEpic, selectedEpic, updateEpic } from '../../state/epicState.js';
import { renderEpics } from '../epicView.js';

// DOM Elements
const createEpicModal = document.getElementById('createEpicModal');
const createEpicForm = document.getElementById('createEpicForm');
const editEpicModal = document.getElementById('editEpicModal');
const editEpicForm = document.getElementById('editEpicForm');
const editEpicNameInput = document.getElementById('editEpicName');
const editEpicDescriptionInput = document.getElementById('editEpicDescription');

// Initialize epic modals
export const initEpicModals = () => {
    // Handle epic creation
    createEpicForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const epicName = document.getElementById('epicName').value;
        if (!currentTeam) return;
        
        try {
            const epic = await client.createEpic(currentTeam.id, { name: epicName });
            addEpic(epic);
            renderEpics();
            createEpicModal.style.display = 'none';
        } catch (error) {
            alert('Failed to create epic: ' + error.message);
        }
    });

    // Handle epic update
    editEpicForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedEpic) return;
        
        const epicName = editEpicNameInput.value;
        const epicDescription = editEpicDescriptionInput.value;
        
        try {
            const updatedEpic = await client.updateEpic(selectedEpic.id, { 
                name: epicName, 
                description: epicDescription 
            });
            
            updateEpic(updatedEpic);
            renderEpics();
            editEpicModal.style.display = 'none';
        } catch (error) {
            alert('Failed to update epic: ' + error.message);
        }
    });
};

// Show create epic modal
export const showCreateEpicModal = () => {
    document.getElementById('epicName').value = '';
    createEpicModal.style.display = 'flex';
};

// Show edit epic modal
export const showEditEpicModal = (epic) => {
    editEpicNameInput.value = epic.name;
    editEpicDescriptionInput.value = epic.description || '';
    editEpicModal.style.display = 'flex';
};