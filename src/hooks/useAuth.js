import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {signInUser, SignUpUser} from '../services/AuthService.js';
import { login, logout } from '../store/slices/userSlice.js';
import { Toast } from '../helpers/toastService.js';

export const useAuth = () => {
    // const token = localStorage.getItem('token');
    // const isAuthenticated = !!token;
    // const isAdmin = token && JSON.parse(atob(token.split('.')[1])).role === 'admin';
    // const role = token ? JSON.parse(atob(token.split('.')[1])).role : null;
    // const user = token ? JSON.parse(atob(token.split('.')[1])).user : null;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignIn = async (credentials, setError) => {
        try {
            const response = await signInUser(credentials);
            const {data} = response;

            const user = data.user;
            const role = user.role;

            console.log(user);
            console.log(role);

            if (!data?.token) {
                Toast.error('Đăng nhập thất bại!');
                setError('Sai tài khoản hoặc mật khẩu.');
                return;
            }

            localStorage.setItem('token', data.token);
            dispatch(login({ user, role }));
            Toast.success('Đăng nhập thành công');

            navigate(role === 'admin' ? '/dashboard' : '/home');
        } catch (e) {
            console.error(e);
            Toast.error('Sai tài khoản hoặc mật khẩu');

            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleSignUp = async (userData, setError) => {
        try {
            const response = await SignUpUser(userData);
            if (response?.status === 400) {
                Toast.error('Thông tin đăng ký không hợp lệ!');
                setError('Thông tin đăng ký không hợp lệ!');
                return;
            }

            navigate('/sign-in');
            Toast.success('Bạn đã đăng ký thành công!');
            Toast.info('Đang chuyển hướng đến trang đăng nhập...');
        } catch (e) {
            Toast.error('Thông tin đăng ký không hợp lệ!2');
            console.log('Fail to sign up', e);
            setError?.('Thông tin đăng ký không hợp lệ!2');
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
