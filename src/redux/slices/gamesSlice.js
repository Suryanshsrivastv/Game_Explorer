import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

// Async thunk for fetching games
export const fetchGames = createAsyncThunk(
    'games/fetchGames',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/games', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch games');
        }
    }
);

// Async thunk for fetching game details
export const fetchGameDetails = createAsyncThunk(
    'games/fetchGameDetails',
    async (id, { rejectWithValue }) => {
        try {
            // Fetch basic game details
            const gameResponse = await api.get(`/games/${id}`);

            // Fetch screenshots in parallel
            const screenshotsResponse = await api.get(`/games/${id}/screenshots`);

            // Combine the data
            return {
                ...gameResponse.data,
                screenshots: screenshotsResponse.data,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch game details');
        }
    }
);

const gamesSlice = createSlice({
    name: 'games',
    initialState: {
        games: [],
        currentGame: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
        count: 0,
        totalPages: 0,
    },
    reducers: {
        clearCurrentGame: (state) => {
            state.currentGame = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchGames
            .addCase(fetchGames.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.games = action.payload.results;
                state.count = action.payload.count;
                // Calculate total pages (assuming 20 items per page)
                state.totalPages = Math.ceil(action.payload.count / 20);
            })
            .addCase(fetchGames.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch games';
            })

            // Handle fetchGameDetails
            .addCase(fetchGameDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGameDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentGame = action.payload;
            })
            .addCase(fetchGameDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch game details';
            });
    },
});

export const { clearCurrentGame } = gamesSlice.actions;

export default gamesSlice.reducer;