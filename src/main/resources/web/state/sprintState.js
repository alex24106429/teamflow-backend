// Sprint state management
export let currentSprint = null;
export let sprints = [];

export const setCurrentSprint = (sprint) => {
    currentSprint = sprint;
};

export const setSprints = (newSprints) => {
    sprints = newSprints;
};

export const addSprint = (sprint) => {
    sprints.push(sprint);
};

export const updateSprint = (updatedSprint) => {
    sprints = sprints.map(sprint => sprint.id === updatedSprint.id ? updatedSprint : sprint);
};

export const removeSprint = (sprintId) => {
    sprints = sprints.filter(sprint => sprint.id !== sprintId);
};

export const clearSprintState = () => {
    currentSprint = null;
    sprints = [];
};