import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './slices/gamesSlice';
import bookmarksReducer from './slices/bookmarksSlice';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
    reducer: {
        games: gamesReducer,
        bookmarks: bookmarksReducer,
        filters: filtersReducer,
    },
});

export default store;