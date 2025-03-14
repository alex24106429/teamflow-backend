import { teams, currentTeam } from '../state/teamState.js';
import { selectTeam } from '../services/teamService.js';
import { showChatView } from './viewManager.js';

// DOM Elements
const teamsList = document.getElementById('teamsList');
const currentTeamHeader = document.getElementById('currentTeamHeader');

// Render teams in sidebar
export const renderTeams = () => {
    teamsList.innerHTML = '';
    
    if (teams.length === 0) {
        // Add a helpful message when there are no teams
        const emptyTeamsMessage = document.createElement('div');
        emptyTeamsMessage.className = 'empty-state';
        emptyTeamsMessage.innerHTML = `
            <p>No teams yet</p>
            <p>Click + below to create one</p>
        `;
        teamsList.appendChild(emptyTeamsMessage);
        return;
    }
    
    teams.forEach(team => {
        const teamIcon = document.createElement('div');
        teamIcon.className = 'team-icon';
        teamIcon.textContent = team.name.charAt(0).toUpperCase();
        teamIcon.title = team.name;
        teamIcon.dataset.id = team.id;
        
        if (currentTeam && team.id === currentTeam.id) {
            teamIcon.classList.add('active');
        }
        
        teamIcon.addEventListener('click', () => {
            selectTeam(team);
            showChatView(); // Switch to chat view when team is selected
        });
        
        teamsList.appendChild(teamIcon);
    });
};

// Update team header
export const updateTeamHeader = () => {
    if (currentTeam) {
        currentTeamHeader.querySelector('h3').textContent = currentTeam.name;
    } else {
        currentTeamHeader.querySelector('h3').textContent = 'Select a Team';
    }
};