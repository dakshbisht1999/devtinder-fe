import { createSlice } from "@reduxjs/toolkit";

const emailServiceNoticeSlice = createSlice({
    name: "emailServiceNotice",
    initialState: "",
    reducers: {
        setEmailServiceNotice: (_, action) => action.payload,
    },
});

export const { setEmailServiceNotice } = emailServiceNoticeSlice.actions;
export default emailServiceNoticeSlice.reducer;
