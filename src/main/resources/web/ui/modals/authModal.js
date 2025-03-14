import { client } from '../../services/apiClient.js';
import { setCurrentUser } from '../../state/userState.js';
import { showApp } from '../viewManager.js';
import { loadTeams } from '../../services/teamService.js';
import { showHomeView } from '../viewManager.js';

// DOM Elements
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Handle auth tab switching
export const initAuthTabSwitching = () => {
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            const tabType = tab.getAttribute('data-tab');
            document.getElementById(`${tabType}Form`).classList.add('active');
        });
    });
};

// Handle login
export const initLoginForm = () => {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            await client.login(username, password);
            setCurrentUser({ username }); // In real app, fetch user details from API
            
            // Store username in localStorage for persistence
            localStorage.setItem('teamflow_username', username);
            
            showApp();
            await loadTeams();
            showHomeView(); // Show home view after login
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });
};

// Handle registration
export const initRegisterForm = () => {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        try {
            await client.register(username, password);
            setCurrentUser({ username }); // In real app, fetch user details from API
            
            // Store username in localStorage for persistence
            localStorage.setItem('teamflow_username', username);
            
            showApp();
            await loadTeams();
            showHomeView(); // Show home view after registration
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    });
};