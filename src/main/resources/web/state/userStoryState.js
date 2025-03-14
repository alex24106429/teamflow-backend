// User Story state management
export let userStories = [];

export const setUserStories = (newUserStories) => {
    userStories = newUserStories;
};

export const addUserStory = (userStory) => {
    userStories.push(userStory);
};

export const updateUserStory = (updatedUserStory) => {
    userStories = userStories.map(us => us.id === updatedUserStory.id ? updatedUserStory : us);
};

export const removeUserStory = (userStoryId) => {
    userStories = userStories.filter(us => us.id !== userStoryId);
};

export const clearUserStoryState = () => {
    userStories = [];
};