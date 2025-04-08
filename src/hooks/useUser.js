import API_INSTANCE from '@/services/api_instance.js';
import { getMe, updateUser } from '@/services/UserService.js';
import {useDispatch, useSelector} from 'react-redux';
import { Toast } from '@/helpers/toastService.js';
import { login, logout } from '@/store/slices/userSlice.js';

export const useUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const handleGetMe = async (setIsLoading) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                Toast.info('Please login again');
                dispatch(logout());
                return;
            }

            const response = await getMe();

            if (response.status !== 200) {
                Toast.error('Login failed');
                localStorage.removeItem('token');
                dispatch(logout());
                return;
            }

            const user = response.data.user;
            const role = user.role;

            dispatch(login({ user, role }));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    };
    const handleUpdateUser = async (userData, userId, setError) => {
        try {
            if (!userData.name || !userData.email || !userData) {
                Toast.error('Please fill in all required information!');
                setError('Please fill in all required information!');
                return;
            }
            const response = await updateUser(userData, userId);
            console.log(response.status);

            if (response.status !== 201) {
                Toast.error('Update failed!');
                setError('Update failed!');
                return;
            }

            console.log(response.data);

            // dispatch(login({user: updatedUser, role: updatedRole})); // Dispatch updated user data
            Toast.success('User information updated successfully!');
        } catch (e) {
            console.error(e);
            Toast.error('Something went wrong. Please try again.');
            setError('Something went wrong. Please try again.');
        }
    };

    return {
        handleGetMe,
        handleUpdateUser,
    };
};
