import { useDispatch, useSelector } from 'react-redux';
import { Toast } from '@/helpers/toastService.js';
import { logout } from '@/store/slices/userSlice.js';
import {
    DELETEEventById,
    fetchAllEvent,
    fetchEventById,
    fetchMyEvent,
    POSTCreateEvent,
    updateEventById,
} from '@/services/EventService.js';

export const useEvent = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const getAllEvents = async ({ page, limit, isAcs }) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                Toast.info('No token found. Please login again');
                dispatch(logout());
                return;
            }

            const data = await fetchAllEvent({
                page: page,
                limit: limit,
                isAcs: isAcs,
            });

            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    };

    const getMyEvent = async ({ page, limit, isAcs }) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                Toast.info('No token found. Please login again');
                dispatch(logout());
                return;
            }

            const data = await fetchMyEvent({
                page: page,
                limit: limit,
                isAcs: isAcs,
            });

            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    };

    const getEventById = async (id) => {
        if(!id){
            Toast.info('No ID found. Please check the event ID');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            Toast.info('No token found. Please login again');
            dispatch(logout());
            return;
        }
        const response = await fetchEventById(id);
        console.log('Get Event ID:', response);
        return response;
    };

    const updateEvent = async (eventId, updatedEventData) => {
        if(!eventId){
            Toast.info('No ID found. Please check the event ID');
            return;
        }
        if(!updatedEventData){
            Toast.info('No data found. Please check the event data');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            Toast.info('No token found. Please login again');
            dispatch(logout());
            return;
        }
        try{
            const response = await updateEventById(eventId, updatedEventData);
            return response;
        }
        catch(error){
            console.error('Error updating event data', error);
            throw error;
        }
    };

    const deleteEvent = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                Toast.info('No token found. Please login again');
                dispatch(logout());
                return;
            }
            const response = await DELETEEventById(id);
            return response.data;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    };

    const createEvent = async (eventData) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                Toast.info('No token found. Please login again');
                dispatch(logout());
                return;
            }

            return await POSTCreateEvent(eventData);
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    };

    return {
        getAllEvents,
        getEventById,
        updateEvent,
        deleteEvent,
        createEvent,
        getMyEvent,
    };
};
