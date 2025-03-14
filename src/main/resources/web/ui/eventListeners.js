import { client } from '../services/apiClient.js';
import { clearCurrentUser } from '../state/userState.js';
import { clearTeamState } from '../state/teamState.js';
import { clearSprintState } from '../state/sprintState.js';
import { clearEpicState } from '../state/epicState.js';
import { showAuth, showHomeView, showChatView } from './viewManager.js';
import { sendMessage } from './chatView.js';
import { showCreateTeamModal } from './modals/teamModal.js';
import { showStartSprintModal } from './modals/sprintModal.js';
import { showCreateEpicModal } from './modals/epicModal.js';
import { showCreateUserStoryModal } from './modals/userStoryModal.js';
import { showCreateTaskModal } from './modals/taskModal.js';
import { initAuthTabSwitching, initLoginForm, initRegisterForm } from './modals/authModal.js';
import { initTeamModal } from './modals/teamModal.js';
import { initSprintModal } from './modals/sprintModal.js';
import { initEpicModals } from './modals/epicModal.js';
import { initUserStoryModal } from './modals/userStoryModal.js';
import { initTaskModal } from './modals/taskModal.js';

// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const addTeamButton = document.querySelector('.add-team-button');
const closeModalBtns = document.querySelectorAll('.close-modal');
const startSprintBtn = document.getElementById('startSprintBtn');
const messageInput = document.getElementById('messageInput');
const addEpicButton = document.getElementById('addEpicButton');
const addUserStoryButton = document.getElementById('addUserStoryButton');
const addTaskButton = document.getElementById('addTaskButton');
const homeIcon = document.querySelector('.home-icon');
const homeCreateTeamBtn = document.getElementById('homeCreateTeamBtn');

// Initialize all event listeners
export const initEventListeners = () => {
    // Initialize auth related functionality
    initAuthTabSwitching();
    initLoginForm();
    initRegisterForm();
    
    // Initialize modals
    initTeamModal();
    initSprintModal();
    initEpicModals();
    initUserStoryModal();
    initTaskModal();
    
    // Handle logout
    logoutBtn.addEventListener('click', () => {
        client.logout();
        localStorage.removeItem('teamflow_username'); // Clear stored username
        clearCurrentUser();
        clearTeamState();
        clearSprintState();
        clearEpicState();
        showAuth();
    });
    
    // Show create team modal
    addTeamButton.addEventListener('click', () => {
        showCreateTeamModal();
    });
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Handle starting a new sprint - show modal
    startSprintBtn.addEventListener('click', () => {
        showStartSprintModal();
    });
    
    // Send message on Enter
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Show create epic modal
    addEpicButton.addEventListener('click', () => {
        showCreateEpicModal();
    });
    
    // Show create user story modal when button is clicked
    addUserStoryButton.addEventListener('click', () => {
        import('../state/epicState.js').then(module => {
            if (!module.selectedEpic) {
                alert('Please select an epic first by right-clicking on an epic and selecting "Select Epic"');
                return;
            }
            showCreateUserStoryModal(module.selectedEpic.id);
        });
    });
    
    // Show create task modal when button is clicked
    addTaskButton.addEventListener('click', () => {
        // Find the active user story
        const activeUserStoryItem = document.querySelector('.channel-item.active');
        if (!activeUserStoryItem) {
            alert('Please select a user story first');
            return;
        }
        
        import('../state/userStoryState.js').then(module => {
            const userStoryName = activeUserStoryItem.querySelector('span').textContent;
            const userStory = module.userStories.find(us => us.name === userStoryName);
            if (userStory) {
                showCreateTaskModal(userStory.id);
            } else {
                alert('Please select a user story first');
            }
        });
    });
    
    // Home icon click handler - show home view
    homeIcon.addEventListener('click', () => {
        showHomeView();
    });
    
    // Home create team button click handler
    homeCreateTeamBtn.addEventListener('click', () => {
        showCreateTeamModal();
    });
    
    // When click outside modal, close it
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
};

// Initialize all event listeners
initEventListeners();