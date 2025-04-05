import { createSlice } from '@reduxjs/toolkit';


const loadFilters = () => {
    try {
        const serializedFilters = localStorage.getItem('gameFilters');
        if (serializedFilters === null) {
            return {
                categories: [],
                tags: [],
                releaseYear: '',
                popularity: ''
            };
        }
        return JSON.parse(serializedFilters);
    } catch (error) {
        console.error('Error loading filters from localStorage:', error);
        return {
            categories: [],
            tags: [],
            releaseYear: '',
            popularity: ''
        };
    }
};


const saveFilters = (filters) => {
    try {
        const serializedFilters = JSON.stringify(filters);
        localStorage.setItem('gameFilters', serializedFilters);
    } catch (error) {
        console.error('Error saving filters to localStorage:', error);
    }
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState: loadFilters(),
    reducers: {
        updateFilters: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
            saveFilters(state);
        },
        resetFilters: (state) => {
            state.categories = [];
            state.tags = [];
            state.releaseYear = '';
            state.popularity = '';
            saveFilters(state);
        },
        setAllFilters: (state, action) => {
            const newFilters = action.payload;
            Object.keys(newFilters).forEach(key => {
                state[key] = newFilters[key];
            });
            saveFilters(state);
        }
    },
});

export const { updateFilters, resetFilters, setAllFilters } = filtersSlice.actions;

export default filtersSlice.reducer;