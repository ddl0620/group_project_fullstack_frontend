import { Outlet } from 'react-router-dom';
import NavBar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";


function UserLayout() {
    return (


        <div className="flex flex-col min-h-screen">
            {/* Thanh điều hướng trên cùng */}
            <div className={"mb-17"}>
                <NavBar />
            </div>
            <div className="flex flex-1 flex-col md:flex-row">
                {/* Khu vực chính */}
                <main className="flex-1 p-6 bg-white">
                    <Outlet />
                </main>
                {/* Cột bên phải */}

            </div>
            {/* Chân trang */}
            <Footer />
        </div>
    );
}

export default UserLayout;