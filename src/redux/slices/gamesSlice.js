import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '04fba186a48e459985b93e84e1679e4f';
const BASE_URL = '/api/api';

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
    },
});

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

export const fetchGameDetails = createAsyncThunk(
    'games/fetchGameDetails',
    async (id, { rejectWithValue }) => {
        try {
           
            const gameResponse = await api.get(`/games/${id}`);

          
            const screenshotsResponse = await api.get(`/games/${id}/screenshots`);

            
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
        status: 'idle',
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
           
            .addCase(fetchGames.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.games = action.payload.results;
                state.count = action.payload.count;
               
                state.totalPages = Math.ceil(action.payload.count / 20);
            })
            .addCase(fetchGames.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch games';
            })

            
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