// View state management
export let currentView = 'home'; // 'home' or 'chat'

export const setCurrentView = (view) => {
    currentView = view;
};