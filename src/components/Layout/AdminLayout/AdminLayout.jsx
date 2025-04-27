import { Outlet } from 'react-router-dom';
import NavBar from '../../Navbar.jsx';
import Footer from '../../Footer.jsx';
import * as PropTypes from 'prop-types';

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Thanh điều hướng trên cùng */}
      <NavBar />
      <div className="flex flex-1">
        {/* Thanh bên trái */}
        {/*<SideBar className="hidden w-64 bg-gray-200 p-4 md:block" />*/}
        {/* Khu vực chính */}
        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
      {/* Chân trang */}
      <Footer />
    </div>
  );
}

export default AdminLayout;
