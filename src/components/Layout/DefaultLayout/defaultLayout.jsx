import { Outlet } from 'react-router-dom';
import NavBar from '../../Navbar.jsx';
import Footer from '../../Footer.jsx';

function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Thanh điều hướng trên cùng */}
      <NavBar />
      {/* Khu vực chính */}
      <main className="flex-1 bg-gray-100 pt-22">
        <Outlet />
      </main>
      {/* Chân trang */}
      <Footer />
    </div>
  );
}

export default DefaultLayout;
