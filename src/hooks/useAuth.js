import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInUser, SignUpUser, VerifyCodeAPI } from '../services/AuthService.js';
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

      if (!content?.token) {
        Toast.error(response.message);
        setError(response.message);
        return;
      }

      localStorage.setItem('token', content.token);
      dispatch(login({ user, role }));
      Toast.success('Đăng nhập thành công');

      navigate(role === 'admin' ? '/dashboard' : '/dashboard');
    } catch (e) {
      console.error(e);
      Toast.error(e.response.data.message || "Có lỗi xảy ra. Vui lòng thử lại.");

      setError(e.response.data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleSignUp = async (userData, setError) => {
    try {
      if (!userData.name || !userData.email || !userData.password || !userData.confirmPassword || !userData.dateOfBirth) {
        Toast.error('Vui lòng nhập đầy đủ thông tin đăng ký!');
        setError('Vui lòng nhập đầy đủ thông tin đăng ký!');
        return;
      }

      const response = await SignUpUser(userData);
      //need more specific error handling
      if (response?.status === 400) {
        Toast.error('Thông tin đăng ký không hợp lệ!');
        setError('Thông tin đăng ký không hợp lệ!');
        return;
      }

      navigate('/sign-in');
      Toast.success('Bạn đã đăng ký thành công!');
      Toast.info('Đang chuyển hướng đến trang đăng nhập...');
    } catch (e) {
      //need more specific error handling
      Toast.error(e.response.data.message || 'Thông tin đăng ký không hợp lệ!');
      console.log('Fail to sign up', e);
      setError?.(e.response.data.message || 'Thông tin đăng ký không hợp lệ!');
    }
  };

  const handleSignOut = () => {
    const token = localStorage.getItem('token');
    if (token) localStorage.removeItem('token');
    dispatch(logout());
    Toast.success('Bạn đang đăng xuất');
  };

  return {
    handleSignIn,
    handleSignOut,
    handleSignUp,
  };
};
