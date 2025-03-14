import { client } from './apiClient.js';
import { setCurrentTeam, setTeams, teams } from '../state/teamState.js';
import { loadSprints } from './sprintService.js';
import { loadEpics } from './epicService.js';
import { renderTeams, updateTeamHeader } from '../ui/teamView.js';
import { renderHomeTeams } from '../ui/homeView.js';

// Load teams from API
export const loadTeams = async () => {
    try {
        const fetchedTeams = await client.getAllTeams();
        setTeams(fetchedTeams);
        renderTeams();
        renderHomeTeams(); // Update home view teams list
        
        if (teams.length > 0) {
            selectTeam(teams[0]); // Select first team by default
        }
    } catch (error) {
        console.error('Failed to load teams', error);
    }
};

// Select a team
export const selectTeam = async (team) => {
    setCurrentTeam(team);
    updateTeamHeader();
    
    // Update UI to show this team is selected
    document.querySelectorAll('.team-icon').forEach(icon => {
        icon.classList.remove('active');
        if (icon.dataset.id === team.id) {
            icon.classList.add('active');
        }
    });
    
    // Load sprints for this team
    await loadSprints(team.id);
    
    // Load epics for this team
    await loadEpics(team.id);
};