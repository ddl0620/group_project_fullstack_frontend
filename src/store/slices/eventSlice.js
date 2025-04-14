// src/store/slices/eventSlice.js
import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
    name: 'event',
    initialState: {
        events: [], // Danh sách tất cả sự kiện
        myEvents: [], // Danh sách sự kiện của người dùng
        currentEvent: null, // Sự kiện hiện tại (dùng cho UpdateEventPage)
        loading: false,
        error: null,
    },
    reducers: {
        setEvents(state, action) {
            state.events = action.payload;
        },
        setMyEvents(state, action) {
            state.myEvents = action.payload;
        },
        setCurrentEvent(state, action) {
            state.currentEvent = action.payload;
        },
        addEvent(state, action) {
            state.myEvents.push(action.payload);
        },
        updateEvent(state, action) {
            const updatedEvent = action.payload;
            state.myEvents = state.myEvents.map((event) =>
                event._id === updatedEvent._id ? updatedEvent : event
            );
            if (state.currentEvent?._id === updatedEvent._id) {
                state.currentEvent = updatedEvent;
            }
        },
        removeEvent(state, action) {
            const id = action.payload;
            state.myEvents = state.myEvents.filter((event) => event._id !== id);
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    setEvents,
    setMyEvents,
    setCurrentEvent,
    addEvent,
    updateEvent,
    removeEvent,
    setLoading,
    setError,
} = eventSlice.actions;

export default eventSlice.reducer;