import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import feedReducer from './feedSlice';
import connectionsReducer from './connectionsSlice';
import requestsReducer from './requestsSlice';
import emailServiceNoticeReducer from './emailServiceNoticeSlice';

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    requests: requestsReducer,
    emailServiceNotice: emailServiceNoticeReducer,
  },
})

export default appStore;
