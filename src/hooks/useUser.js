import APIServices from '@/services/APIServices.js';
import {
  getMe,
  updateUser,
  updatePassword,
  getUserById as getUserByIdAPI,
} from '@/services/UserService.js';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from '@/helpers/toastService.js';
import { login, logout } from '@/store/slices/userSlice.js';
import { setError, setLoading } from '@/store/slices/eventSlice.js';
import { checkToken } from '@/helpers/checkToken.js';

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

      const user = response.content.user;
      const role = user.role;

      dispatch(login({ user, role }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };
  const handleUpdateUser = async (userData, userId, setError) => {
    const loadingToast = Toast.loading('Updating user information...');
    try {
      if (!userData.get("name") || !userData.get("dateOfBirth")) {
        Toast.error('Please fill in all required information!');
        setError('Please fill in all required information!');
        return;
      }
      const response = await updateUser(userData, userId);

      if (!response.success) {
        Toast.error('Update failed!');
        setError('Update failed!');
        return;
      }

      Toast.success('User information updated successfully!');
    } catch (e) {
      console.error(e);
      Toast.error(e.response.data.message || 'Something went wrong. Please try again.');
      setError('Something went wrong. Please try again.');
    }
    finally {
      Toast.dismiss(loadingToast);
    }
  };

  const handleUpdatePassword = async (userData, userId, setError) => {
    const loadingToast = Toast.loading('Updating password information...');
    try {
      console.log(userData);
      const response = await updatePassword(userData, userId);

      if (!response.success) {
        Toast.error('Update failed!');
        setError('Update failed!');
        return;
      }

      Toast.success('Password updated successfully!');
    } catch (e) {
      console.error(e);
      Toast.error(e.response.data.message || 'Something went wrong. Please try again.');
      setError(e.response.data.message || 'Something went wrong. Please try again.');
    }
    finally {
      Toast.dismiss(loadingToast);
    }
  };


  const getUserById = async (userId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await getUserByIdAPI(userId);
      // if (response.success) Toast.success(response.message);
      // else Toast.error(response.message);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      console.log(error);
      Toast.error(error.response.data.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    getUserById,
    handleGetMe,
    handleUpdateUser,
    handleUpdatePassword
  };
};
