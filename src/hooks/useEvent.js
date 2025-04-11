import { getMe, updateUser } from '@/services/UserService.js';
import {useDispatch, useSelector} from 'react-redux';
import { Toast } from '@/helpers/toastService.js';
import { login, logout } from '@/store/slices/userSlice.js';
import {fetchAllEvent} from "@/services/EventService.js";

export const useEvent = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const getAllEvents = async ({page, limit, isAcs}) => {

        const toastId = Toast.success('Loading events...');
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                Toast.info('No token found. Please login again');
                dispatch(logout());
                return;
            }

            const data = await fetchAllEvent({page: page, limit: limit, isAcs: isAcs});

            Toast.success('Events loaded successfully');


            return data;
            // console.log('response get All event', response);
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
        finally {
            Toast.promise(toastId);
        }

    };


    return {
        getAllEvents
    };
};
