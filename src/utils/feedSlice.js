import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: 'feed',
    initialState: [],
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeUserFromFeed: (state, action) =>
            state.filter((user) => user._id !== action.payload),
    }
})

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
