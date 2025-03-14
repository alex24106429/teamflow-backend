import { client } from '../../services/apiClient.js';
import { addTeam } from '../../state/teamState.js';
import { renderTeams } from '../teamView.js';
import { selectTeam } from '../../services/teamService.js';

// DOM Elements
const createTeamModal = document.getElementById('createTeamModal');
const createTeamForm = document.getElementById('createTeamForm');

// Initialize team modal
export const initTeamModal = () => {
    // Handle team creation
    createTeamForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const teamName = document.getElementById('teamName').value;
        
        try {
            const team = await client.createTeam(teamName);
            addTeam(team);
            renderTeams();
            createTeamModal.style.display = 'none';
            selectTeam(team);
        } catch (error) {
            alert('Failed to create team: ' + error.message);
        }
    });
};

// Show create team modal
export const showCreateTeamModal = () => {
    createTeamModal.style.display = 'flex';
};