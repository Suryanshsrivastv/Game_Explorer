import { createSlice } from '@reduxjs/toolkit';


const loadBookmarks = (userId) => {
    try {
        const storageKey = getUserBookmarkKey(userId);
        const serializedBookmarks = localStorage.getItem(storageKey);
        if (serializedBookmarks === null) {
            return [];
        }
        return JSON.parse(serializedBookmarks);
    } catch (error) {
        console.error('Error loading bookmarks from localStorage:', error);
        return [];
    }
};

const getUserBookmarkKey = (userId) => {
    return userId ? `gameBookmarks_${userId}` : 'gameBookmarks';
};


const saveBookmarks = (bookmarks, userId) => {
    try {
        const serializedBookmarks = JSON.stringify(bookmarks);
        const storageKey = getUserBookmarkKey(userId);
        localStorage.setItem(storageKey, serializedBookmarks);
    } catch (error) {
        console.error('Error saving bookmarks to localStorage:', error);
    }
};

const bookmarksSlice = createSlice({
    name: 'bookmarks',
    initialState: {
        items: [],
        userId: null
    },
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
          
            state.items = loadBookmarks(action.payload);
        },
        addBookmark: (state, action) => {
            
            const exists = state.items.some(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
                saveBookmarks(state.items, state.userId);
            }
        },
        removeBookmark: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveBookmarks(state.items, state.userId);
        },
        clearBookmarks: (state) => {
            state.items = [];
            saveBookmarks(state.items, state.userId);
        },
    },
});

export const { addBookmark, removeBookmark, clearBookmarks, setUserId } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;