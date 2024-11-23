import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:7210/api/Students';

// Fetch all students
export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

// Add a new student
export const addStudent = createAsyncThunk('students/addStudent', async (student) => {
    const response = await axios.post(API_URL, student);
    return response.data;
});

const studentSlice = createSlice({
    name: 'students',
    initialState: { data: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchStudents.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = 'succeeded';
        });
        builder.addCase(fetchStudents.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchStudents.rejected, (state) => {
            state.status = 'failed';
        });
        builder.addCase(addStudent.fulfilled, (state, action) => {
            state.data.push(action.payload);
        });
    },
});

export default studentSlice.reducer;