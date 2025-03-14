import { teams } from '../state/teamState.js';
import { epics } from '../state/epicState.js';
import { sprints } from '../state/sprintState.js';
import { selectTeam } from '../services/teamService.js';
import { selectSprint } from '../services/sprintService.js';
import { showChatView } from './viewManager.js';

// DOM Elements
const homeTeamsList = document.getElementById('homeTeamsList');
const homeRecentEpics = document.getElementById('homeRecentEpics');
const homeActiveSprints = document.getElementById('homeActiveSprints');

// Update home content
export const updateHomeContent = () => {
    // Update teams list in home view
    renderHomeTeams();
    // Update recent epics
    renderHomeEpics();
    // Update active sprints
    renderHomeSprints();
};

// Render teams in home view
export const renderHomeTeams = () => {
    // Clear previous content except the empty state
    const currentEmptyState = homeTeamsList.querySelector('.empty-home-state');
    homeTeamsList.innerHTML = '';
    
    if (teams.length === 0) {
        // Show empty state
        homeTeamsList.appendChild(currentEmptyState);
        return;
    }
    
    // Hide empty state when we have teams
    teams.forEach(team => {
        const teamItem = document.createElement('div');
        teamItem.className = 'home-team-item';
        
        const teamIcon = document.createElement('div');
        teamIcon.className = 'home-team-icon';
        teamIcon.textContent = team.name.charAt(0).toUpperCase();
        
        const teamName = document.createElement('div');
        teamName.className = 'home-team-name';
        teamName.textContent = team.name;
        
        teamItem.appendChild(teamIcon);
        teamItem.appendChild(teamName);
        
        teamItem.addEventListener('click', () => {
            selectTeam(team);
            showChatView();
        });
        
        homeTeamsList.appendChild(teamItem);
    });
};

// Render recent epics in home view
export const renderHomeEpics = () => {
    homeRecentEpics.innerHTML = '';
    
    if (epics.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-home-state';
        emptyState.innerHTML = '<p>No recent epics to display.</p>';
        homeRecentEpics.appendChild(emptyState);
        return;
    }
    
    // Show up to 3 most recent epics
    const recentEpics = epics.slice(0, 3);
    recentEpics.forEach(epic => {
        const epicItem = document.createElement('div');
        epicItem.className = 'home-team-item'; // Reuse the same style
        
        const epicIcon = document.createElement('div');
        epicIcon.className = 'home-team-icon';
        epicIcon.innerHTML = '<i class="fas fa-bookmark"></i>';
        
        const epicName = document.createElement('div');
        epicName.className = 'home-team-name';
        epicName.textContent = epic.name;
        
        epicItem.appendChild(epicIcon);
        epicItem.appendChild(epicName);
        
        homeRecentEpics.appendChild(epicItem);
    });
};

// Render active sprints in home view
export const renderHomeSprints = () => {
    homeActiveSprints.innerHTML = '';
    
    if (sprints.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-home-state';
        emptyState.innerHTML = '<p>No active sprints to display.</p>';
        homeActiveSprints.appendChild(emptyState);
        return;
    }
    
    // Show up to 3 most recent sprints
    const activeSprints = sprints.slice(0, 3);
    activeSprints.forEach(sprint => {
        const sprintItem = document.createElement('div');
        sprintItem.className = 'home-team-item'; // Reuse the same style
        
        const sprintIcon = document.createElement('div');
        sprintIcon.className = 'home-team-icon';
        sprintIcon.innerHTML = '<i class="fas fa-running"></i>';
        
        const sprintName = document.createElement('div');
        sprintName.className = 'home-team-name';
        sprintName.textContent = sprint.name;
        
        sprintItem.appendChild(sprintIcon);
        sprintItem.appendChild(sprintName);
        
        sprintItem.addEventListener('click', () => {
            selectSprint(sprint);
            showChatView();
        });
        
        homeActiveSprints.appendChild(sprintItem);
    });
};