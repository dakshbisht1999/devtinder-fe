import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name: 'connections',
    initialState: [],
    reducers: {
        addConnections: (state, action) => {
            return action.payload;
        },
        appendConnections: (state, action) => {
            state.push(...action.payload);
        },
        // removeUserFromFeed: (state, action) =>
        //     state.filter((user) => user._id !== action.payload),
    }
})

export const { addConnections, appendConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;
