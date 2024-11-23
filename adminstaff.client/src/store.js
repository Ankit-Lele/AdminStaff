import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './features/studentSlice';
import familyMemberReducer from './features/familyMemberSlice';

export const store = configureStore({
    reducer: {
        students: studentReducer,
        familyMembers: familyMemberReducer,
    },
});