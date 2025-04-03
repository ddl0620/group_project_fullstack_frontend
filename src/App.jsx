import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/slices/userSlice';

import routes from "./routes/routes.jsx";
import API_INSTANCE from "./services/AuthService.js";
import {ToastContainer} from "react-toastify";
import {Toaster} from "sonner";

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
            API_INSTANCE
                .get('/api/v1/user/me')
                .then((response) => {
                    const { user, role } = response.data;
                    dispatch(login({ user, role }));
                })
                .catch(() => {
                    localStorage.removeItem('token'); // Xóa token nếu không hợp lệ
                });
        }
    }, []); // ✅ Thêm dependency array để chỉ chạy một lần


    return (
        <BrowserRouter>
            <Routes>{renderRoutes(routes)}</Routes>
            {/*<ToastContainer*/}
            {/*    position="top-right"*/}
            {/*    autoClose={2000}*/}
            {/*    hideProgressBar={false}*/}
            {/*    newestOnTop*/}
            {/*    closeOnClick*/}
            {/*    theme="colored" // hoặc "light", "dark"*/}
            {/*/>*/}
            <Toaster
                position="top-right"
                theme="light"
                richColors={true}
                closeButton={false}
                duration={3000}
            />

        </BrowserRouter>
    );
}

export default App;