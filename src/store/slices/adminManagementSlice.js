import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  users: [],
  events: [],
  userActivities: {
    joiningEvents: [],
    organizedEvents: [],
    // discussionPosts: [],
  },
  eventDetails: {
    event: null,
    participants: {
      accepted: [],
      pending: [],
      denied: [],
    },
    invitations: [],
  },
  pagination: {
    users: { page: 1, limit: 10, totalPages: 0, totalUsers: 0 },
    events: { page: 1, limit: 10, totalPages: 0, totalEvents: 0 },
  },
  loading: false,
  error: null,
}

const adminManagementSlice = createSlice({
  name: "adminManagement",
  initialState,
  reducers: {
    // User Management Actions
    setUsers(state, action) {
      state.users = action.payload.users
      state.pagination.users = action.payload.pagination
    },
    addUser(state, action) {
      state.users.unshift(action.payload)
      state.pagination.users.total += 1
    },
    updateUser(state, action) {
      const updatedUser = action.payload
      const index = state.users.findIndex((user) => user._id === updatedUser._id)
      if (index !== -1) {
        state.users[index] = updatedUser
      }
    },
    deleteUser(state, action) {
      const { userId } = action.payload
      const index = state.users.findIndex((user) => user._id === userId)
      if (index !== -1) {
        state.users[index].isDeleted = true
      }
      state.pagination.users.total -= 1
    },
    reactivateUser(state, action) {
      const { userId } = action.payload
      const index = state.users.findIndex((user) => user._id === userId)
      if (index !== -1) {
        state.users[index].isDeleted = false
      }
      state.pagination.users.total += 1
    },
    setUserActivities(state, action) {
      state.userActivities = {
        joiningEvents: action.payload.joiningEvents,
        organizedEvents: action.payload.organizedEvents,
        // discussionPosts: action.payload.discussionPosts,
      }
    },

    // Event Management Actions
    setEvents(state, action) {
      state.events = action.payload.events
      state.pagination.events = action.payload.pagination
    },
    addEvent(state, action) {
      state.events.unshift(action.payload)
      state.pagination.events.total += 1
    },
    updateEvent(state, action) {
      const updatedEvent = action.payload
      const index = state.events.findIndex((event) => event._id === updatedEvent._id)
      if (index !== -1) {
        state.events[index] = {
          ...state.events[index],
          title: updatedEvent.title,
          description: updatedEvent.description,
          type: updatedEvent.type,
          startDate: updatedEvent.startDate,
          endDate: updatedEvent.endDate,
          location: updatedEvent.location,
          images: updatedEvent.images,
          isPublic: updatedEvent.isPublic,
          updatedAt: new Date(),
        }
      }
    },
    deleteEvent(state, action) {
      const { eventId } = action.payload
      const index = state.events.findIndex((event) => event._id === eventId)
      if (index !== -1) {
        state.events[index].isDeleted = true
      }
      state.pagination.events.total -= 1
    },
    setEventDetails(state, action) {
      state.eventDetails = {
        event: action.payload.event,
        participants: {
          accepted: action.payload.participants.accepted,
          pending: action.payload.participants.pending,
          denied: action.payload.participants.denied,
        },
        invitations: action.payload.invitations,
      }
    },

    // Common Actions
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
  },
})

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  reactivateUser,
  setUserActivities,
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setEventDetails,
  setLoading,
  setError,
} = adminManagementSlice.actions

export default adminManagementSlice.reducer
