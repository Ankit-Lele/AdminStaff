import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = 'https://localhost:7210/api/Students';
// Fetch family members of a student
export const fetchFamilyMembers = createAsyncThunk('familyMembers/fetchFamilyMembers', async (studentId) => {
    const response = await axios.get(`${API_URL}/${studentId}/FamilyMembers`);
    return response.data;
});

const familyMemberSlice = createSlice({
    name: 'familyMembers',
    initialState: { data: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchFamilyMembers.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = 'succeeded';
        });
        builder.addCase(fetchFamilyMembers.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchFamilyMembers.rejected, (state) => {
            state.status = 'failed';
        });
    },
});

export default familyMemberSlice.reducer;