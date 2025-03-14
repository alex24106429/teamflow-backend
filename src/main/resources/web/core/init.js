import { client } from '../services/apiClient.js';
import { currentUser, setCurrentUser } from '../state/userState.js';
import { loadTeams } from '../services/teamService.js';
import { showApp, showAuth, showHomeView } from '../ui/viewManager.js';
// Check if user is already logged in
export const init = async () => {
    if (client.token) {
        try {
            // Get username from localStorage
            const savedUsername = localStorage.getItem('teamflow_username');
            if (savedUsername) {
                setCurrentUser({ username: savedUsername });
            }
            // Fetch user data and teams
            showApp();
            await loadTeams(); // Load teams from API
            showHomeView(); // Show home view by default
        } catch (error) {
            console.error('Session expired or invalid', error);
            client.logout();
            showAuth();
        }
    } else {
        showAuth();
    }
};