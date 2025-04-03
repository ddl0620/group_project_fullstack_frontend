import { Outlet } from 'react-router-dom';
import NavBar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";


function UserLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Thanh điều hướng trên cùng */}
            <NavBar />
            <div className="flex flex-1 flex-col md:flex-row">
                {/* Khu vực chính */}
                <main className="flex-1 p-6 bg-gray-100">
                    <Outlet />
                </main>
                {/* Cột bên phải */}
                <aside className="w-full md:w-1/3 p-6 bg-white border-l">
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded">Block 1: Event Details</div>
                        <div className="p-4 bg-gray-50 rounded">Block 2: Suggestions</div>
                        <div className="p-4 bg-gray-50 rounded">Block 3: Notifications</div>
                    </div>
                </aside>
            </div>
            {/* Chân trang */}
            <Footer />
        </div>
    );
}

export default UserLayout;