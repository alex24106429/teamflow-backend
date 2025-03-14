// Team state management
export let currentTeam = null;
export let teams = [];

export const setCurrentTeam = (team) => {
    currentTeam = team;
};

export const setTeams = (newTeams) => {
    teams = newTeams;
};

export const addTeam = (team) => {
    teams.push(team);
};

export const updateTeam = (updatedTeam) => {
    teams = teams.map(team => team.id === updatedTeam.id ? updatedTeam : team);
};

export const removeTeam = (teamId) => {
    teams = teams.filter(team => team.id !== teamId);
};

export const clearTeamState = () => {
    currentTeam = null;
    teams = [];
};