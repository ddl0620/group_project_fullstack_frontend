import { Outlet } from 'react-router-dom';
import NavBar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";

function DefaultLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Thanh điều hướng trên cùng */}
            <NavBar />
            {/* Khu vực chính */}
            <main className="flex-1 p-6 bg-gray-100">
                <Outlet />
            </main>
            {/* Chân trang */}
            <Footer />
        </div>
    );
}

export default DefaultLayout;