import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/slices/userSlice';

import api from './services/AuthService.js';
import routes from "./routes/routes.jsx";

// Hàm để render các tuyến đường phân cấp
const renderRoutes = (routeList) =>
    routeList.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
            {route.children && renderRoutes(route.children)}
        </Route>
    ));

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.user);

    // Kiểm tra token để tự động đăng nhập khi ứng dụng khởi động
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isAuthenticated) {
            api
                .get('/auth/me')
                .then((response) => {
                    const { user, role } = response.data;
                    dispatch(login({ user, role }));
                })
                .catch(() => {
                    localStorage.removeItem('token'); // Xóa token nếu không hợp lệ
                });
        }
    }, [dispatch, isAuthenticated]);

    return (
        <BrowserRouter>
            <Routes>{renderRoutes(routes)}</Routes>
        </BrowserRouter>
    );
}

export default App;