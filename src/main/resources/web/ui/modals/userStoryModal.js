import { client } from '../../services/apiClient.js';
import { addUserStory, updateUserStory } from '../../state/userStoryState.js';
import { renderUserStories } from '../userStoryView.js';

// DOM Elements
const createUserStoryModal = document.getElementById('createUserStoryModal');
const createUserStoryForm = document.getElementById('createUserStoryForm');

// Initialize user story modal
export const initUserStoryModal = () => {
    // Handle user story creation
    createUserStoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const epicId = createUserStoryModal.dataset.epicId;
        const name = document.getElementById('userStoryName').value;
        const description = document.getElementById('userStoryDescription').value;
        
        try {
            const userStory = await client.createUserStory(epicId, {
                name,
                description,
                status: 'TODO' // Default status
            });
            
            // Add the new user story to the userStories array
            addUserStory(userStory);
            renderUserStories();
            
            // Close the modal and clear the form
            createUserStoryModal.style.display = 'none';
            document.getElementById('userStoryName').value = '';
            document.getElementById('userStoryDescription').value = '';
        } catch (error) {
            alert('Failed to create user story: ' + error.message);
        }
    });
};

// Show create user story modal
export const showCreateUserStoryModal = (epicId) => {
    // Clear form fields
    document.getElementById('userStoryName').value = '';
    document.getElementById('userStoryDescription').value = '';
    
    // Store the epic ID for form submission
    createUserStoryModal.dataset.epicId = epicId;
    
    // Show the modal
    createUserStoryModal.style.display = 'flex';
};

// Show edit user story modal
export const showEditUserStoryModal = (userStory) => {
    // Create modal if it doesn't exist
    let editUserStoryModal = document.getElementById('editUserStoryModal');
    if (!editUserStoryModal) {
        editUserStoryModal = document.createElement('div');
        editUserStoryModal.id = 'editUserStoryModal';
        editUserStoryModal.className = 'modal';
        editUserStoryModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit User Story</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editUserStoryForm">
                        <div class="form-group">
                            <label for="editUserStoryName">USER STORY NAME</label>
                            <input type="text" id="editUserStoryName" required>
                        </div>
                        <div class="form-group">
                            <label for="editUserStoryDescription">USER STORY DESCRIPTION</label>
                            <textarea id="editUserStoryDescription"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="editUserStoryStatus">STATUS</label>
                            <select id="editUserStoryStatus">
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                        <button type="submit" class="modal-button">Update User Story</button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(editUserStoryModal);
        
        // Add close button functionality
        editUserStoryModal.querySelector('.close-modal').addEventListener('click', () => {
            editUserStoryModal.style.display = 'none';
        });
        
        // Add form submission handler
        document.getElementById('editUserStoryForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const userStoryId = editUserStoryModal.dataset.userStoryId;
            const name = document.getElementById('editUserStoryName').value;
            const description = document.getElementById('editUserStoryDescription').value;
            const status = document.getElementById('editUserStoryStatus').value;
            
            try {
                const updatedUserStory = await client.updateUserStory(userStoryId, {
                    name,
                    description,
                    status
                });
                
                // Update user story in the userStories array
                updateUserStory(updatedUserStory);
                renderUserStories();
                editUserStoryModal.style.display = 'none';
            } catch (error) {
                alert('Failed to update user story: ' + error.message);
            }
        });
    }
    
    // Set current values in the form
    document.getElementById('editUserStoryName').value = userStory.name;
    document.getElementById('editUserStoryDescription').value = userStory.description || '';
    document.getElementById('editUserStoryStatus').value = userStory.status || 'TODO';
    
    // Store the user story ID for form submission
    editUserStoryModal.dataset.userStoryId = userStory.id;
    
    // Show the modal
    editUserStoryModal.style.display = 'flex';
};