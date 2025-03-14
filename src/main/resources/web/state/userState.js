// User state management
export let currentUser = null;

export const setCurrentUser = (user) => {
    currentUser = user;
};

export const clearCurrentUser = () => {
    currentUser = null;
};