import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
    name: 'requests',
    initialState: [],
    reducers: {
        addRequests: (state, action) => {
            return action.payload;
        },
        appendRequests: (state, action) => {
            state.push(...action.payload);
        },
        // removeUserFromFeed: (state, action) =>
        //     state.filter((user) => user._id !== action.payload),
    }
})

export const { addRequests, appendRequests } = requestsSlice.actions;
export default requestsSlice.reducer;
