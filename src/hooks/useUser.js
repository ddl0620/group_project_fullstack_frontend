import {
  getMe,
  updateUser,
  updatePassword,
  getUserById as getUserByIdAPI, getAllUsersAPI,
} from '@/services/UserService.js';
import { useDispatch } from 'react-redux';
import { Toast } from '@/helpers/toastService.js';
import { login, logout } from '@/store/slices/userSlice.js';
import { setError, setLoading } from '@/store/slices/eventSlice.js';
import { checkToken } from '@/helpers/checkToken.js';
import { useCallback, useRef } from 'react';
import { setUsers } from '@/store/slices/adminManagementSlice.js';

export const useUser = () => {
  const dispatch = useDispatch();

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
  const cache = useRef({});

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

  const handleGetMe = async (setIsLoading) => {
    try {
      const response = await getMe();

      if (!response.success) {
        Toast.error(response.message || 'Failed to fetch user data');
        dispatch(logout());
        return;
      }

      const user = response.content.user;
      const role = user.role;

      dispatch(login({ user, role }));
    } catch (error) {
      // console.error('Error fetching user data:', error);
      // Toast.info('Please login again');
      dispatch(logout());
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  const fetchUsers = useCallback(
    async (page = 1, limit = 10, isAcs = true, forceRefresh = false) => {
      const cacheKey = `users-${page}-${limit}-${isAcs}`;
      if (!forceRefresh && cache.current[cacheKey]) {
        dispatch(setUsers(cache.current[cacheKey]));
        return cache.current[cacheKey];
      }

      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await getAllUsersAPI(page, limit, isAcs);
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch users');
        }

        const result = {
          users: Array.isArray(response.content.users)
            ? response.content.users
            : [],
          pagination: response.content.pagination || {
            page,
            limit,
            total: response.content.users.length,
          },
        };

        cache.current[cacheKey] = result;
        dispatch(setUsers(result));
        return result;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(setError(errorMessage));
        Toast.error(`Failed to fetch users: ${errorMessage}`);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );


  const getUserById = async (userId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      checkToken();
      const response = await getUserByIdAPI(userId);
      // if (response.success) Toast.success(response.message);
      // else Toast.error(response.message);
      console.log(response);
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
    fetchUsers,
    getUserById,
    handleGetMe,
    handleUpdateUser,
    handleUpdatePassword
  };
};
