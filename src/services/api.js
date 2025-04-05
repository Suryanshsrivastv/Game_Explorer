import axios from 'axios';



const API_KEY = '04fba186a48e459985b93e84e1679e4f';
// Using proxy URL to avoid CORS issues
const BASE_URL = '/api/api';

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
    },
});

export const gameService = {
   
    getGames: async (params = {}) => {
        try {
            const response = await api.get('/games', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    },

    getGameDetails: async (id) => {
        try {
            const gameResponse = await api.get(`/games/${id}`);
            return gameResponse.data;
        } catch (error) {
            console.error('Error fetching game details:', error);
            throw error;
        }
    },

    getGameScreenshots: async (id) => {
        try {
            const screenshotsResponse = await api.get(`/games/${id}/screenshots`);
            return screenshotsResponse.data;
        } catch (error) {
            console.error('Error fetching game screenshots:', error);
            throw error;
        }
    },

    getGenres: async () => {
        try {
            const response = await api.get('/genres');
            return response.data.results;
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    },

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