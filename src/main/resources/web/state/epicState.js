// Epic state management
export let epics = [];
export let selectedEpic = null;

export const setEpics = (newEpics) => {
    epics = newEpics;
};

export const setSelectedEpic = (epic) => {
    selectedEpic = epic;
};

export const addEpic = (epic) => {
    epics.push(epic);
};

export const updateEpic = (updatedEpic) => {
    epics = epics.map(epic => epic.id === updatedEpic.id ? updatedEpic : epic);
};

export const removeEpic = (epicId) => {
    epics = epics.filter(epic => epic.id !== epicId);
};

export const clearEpicState = () => {
    epics = [];
    selectedEpic = null;
};