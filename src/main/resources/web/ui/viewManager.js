import { currentUser } from '../state/userState.js';
import { updateHomeContent } from './homeView.js';

// DOM Elements
const authModal = document.getElementById('authModal');
const appContainer = document.getElementById('appContainer');
const homeView = document.getElementById('homeView');
const chatView = document.getElementById('chatView');
const homeIcon = document.querySelector('.home-icon');
const currentUsername = document.getElementById('currentUsername');

// Show auth modal
export const showAuth = () => {
    authModal.style.display = 'flex';
    appContainer.style.display = 'none';
};

// Show main app
export const showApp = () => {
    authModal.style.display = 'none';
    appContainer.style.display = 'grid';
    // Set current username if available
    if (currentUser) {
        currentUsername.textContent = currentUser.username;
    }
};

// Show home view
export const showHomeView = () => {
    homeView.style.display = 'flex';
    chatView.style.display = 'none';
    // Add home-mode class to body for CSS targeting
    document.body.classList.add('home-mode');
    // Mark home icon as active and remove active from team icons
    document.querySelectorAll('.team-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    homeIcon.classList.add('active');
    // Update home page content
    updateHomeContent();
};

// Show chat view
export const showChatView = () => {
    homeView.style.display = 'none';
    chatView.style.display = 'flex';
    // Remove home-mode class from body
    document.body.classList.remove('home-mode');
    // Remove active from home icon
    homeIcon.classList.remove('active');
};