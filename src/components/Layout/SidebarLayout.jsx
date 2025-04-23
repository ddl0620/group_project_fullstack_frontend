import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.js';
import Footer from '@/components/Footer.jsx';
import { AppSidebar } from '@/components/app-sidebar.jsx';
import NavBar from '@/components/Navbar.jsx';
import { Sidebar } from 'lucide-react';
import Header from '@/pages/Dashboard/User/components/Header.jsx';

function SidebarLayout({title, items }) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Navbar cố định ở trên cùng */}
            <header className="fixed top-0 right-0 left-0 z-50 bg-white">
                <NavBar />
            </header>

            {/* Thêm padding-top để đẩy nội dung xuống dưới Navbar */}
            <div className="flex h-screen pt-22">
                <div className="max-h-screen">
                    <AppSidebar title={title} items={items} />
                </div>
                {/* Outlet chiếm phần còn lại */}
                <main className="flex-1 bg-white p-6">
                    {/*<SidebarTrigger />*/}
                    <Outlet />
                </main>
            </div>
            {/*<Footer />*/}

            {/* Footer ở dưới cùng */}
        </div>
    );
}

export default SidebarLayout;
