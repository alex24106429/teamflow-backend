// Task state management
export let tasks = [];

export const setTasks = (newTasks) => {
    tasks = newTasks;
};

export const addTask = (task) => {
    tasks.push(task);
};

export const updateTask = (updatedTask) => {
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
};

export const removeTask = (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
};

export const clearTaskState = () => {
    tasks = [];
};