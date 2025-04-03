import axios from 'axios';

// RAWG API key - in a real app, this would be stored in an environment variable
// You need to replace this with your own API key from https://rawg.io/apidocs
const API_KEY = '04fba186a48e459985b93e84e1679e4f';
// Using proxy URL to avoid CORS issues
const BASE_URL = '/api/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
    },
});

// Game API services
export const gameService = {
    // Get a list of games with optional filters
    getGames: async (params = {}) => {
        try {
            const response = await api.get('/games', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    },

    // Get details for a specific game
    getGameDetails: async (id) => {
        try {
            const gameResponse = await api.get(`/games/${id}`);
            return gameResponse.data;
        } catch (error) {
            console.error('Error fetching game details:', error);
            throw error;
        }
    },

    // Get screenshots for a specific game
    getGameScreenshots: async (id) => {
        try {
            const screenshotsResponse = await api.get(`/games/${id}/screenshots`);
            return screenshotsResponse.data;
        } catch (error) {
            console.error('Error fetching game screenshots:', error);
            throw error;
        }
    },

    // Get game genres
    getGenres: async () => {
        try {
            const response = await api.get('/genres');
            return response.data.results;
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    },

    // Get game tags
    getTags: async () => {
        try {
            const response = await api.get('/tags');
            return response.data.results;
        } catch (error) {
            console.error('Error fetching tags:', error);
            throw error;
        }
    },
};

export default api;