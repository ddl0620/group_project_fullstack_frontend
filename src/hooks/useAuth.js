import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  signInUser,
  SignOutAPI,
  SignUpUser,
  VerifySignUpAPI,
} from '../services/AuthService.js';
import { login, logout } from '../store/slices/userSlice.js';
import { Toast } from '../helpers/toastService.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async (credentials, setError) => {
    try {
      if (!credentials.email || !credentials.password) {
        Toast.error('Vui lòng nhập đầy đủ thông tin đăng nhập!');
        setError('Vui lòng nhập đầy đủ thông tin đăng nhập!');
        return;
      }

      const response = await signInUser(credentials);
      const { content } = response;

      const user = content.user;
      const role = user.role;

      console.log(user);
      console.log(role);

      if (!response?.success) {
        Toast.error(response.message);
        setError(response.message);
        return;
      }

      // localStorage.setItem('token', content.token);
      dispatch(login({ user, role }));
      Toast.success('Sign in successfully');

      navigate(role === 'admin' ? '/dashboard' : '/dashboard');
    } catch (e) {
      console.error(e);
      Toast.error(
        e.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
      );

      setError(e.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleSignUp = async (userData, setError) => {
    const loading = Toast.loading('Sending OTP code...');
    try {
      if (
        !userData.name ||
        !userData.email ||
        !userData.password ||
        !userData.confirmPassword ||
        !userData.dateOfBirth
      ) {
        Toast.error('Please enter all required fields!');
        setError('Please enter all required fields!');
        return;
      }

      const response = await SignUpUser(userData);
      //need more specific error handling
      if (!response?.success) {
        Toast.error('Cannot sent OTP to your email. Try again');
        setError('Cannot sent OTP to your email. Try again');
        return;
      }

      Toast.success(
        'OTP code has been sent to your email. Please check your inbox'
      );

      return response;
    } catch (e) {
      //need more specific error handling
      Toast.error(e.response.data.message || 'Invalid sign up information!');
      console.log('Fail to sign up', e);
      setError?.(e.response.data.message || 'Invalid sign up information!');
    } finally {
      Toast.dismiss(loading);
    }
  };

  const handleVerifyCodeSignUp = async (userData, setError) => {
    try {
      if (!userData.code || !userData.email) {
        Toast.error('Please enter OTP code and email!');
        setError('Please enter OTP code and email!');
        return;
      }

      const response = await VerifySignUpAPI(userData);
      //need more specific error handling
      if (!response?.success) {
        Toast.error('Verification failed. Try again');
        setError('Verification failed. Try again');
        return;
      }

      navigate('/sign-in');
      Toast.success('Verification successful. You can now sign in');
      Toast.info('Directing to sign-in page...');
    } catch (e) {
      //need more specific error handling
      Toast.error(e.response.data.message || 'Invalid verification code!');
      console.log('Fail to sign up', e);
      setError?.(e.response.data.message || 'Invalid verification code!');
    }
  };

  const handleSignOut = async () => {
    const response = await SignOutAPI();
    if (!response.success) {
      Toast.error('Sign out failed!');
      return;
    }
    dispatch(logout());
    Toast.success('Sign out successfully');
  };

  return {
    handleSignIn,
    handleSignOut,
    handleSignUp,
    handleVerifyCodeSignUp,
  };
};
