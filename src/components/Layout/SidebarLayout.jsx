import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.js";
import Footer from "@/components/Footer.jsx";
import { AppSidebar } from "@/components/app-sidebar.jsx";
import NavBar from "@/components/Navbar.jsx";

function SidebarLayout({ items }) {
    return (
        <SidebarProvider className={"flex flex-col"}>
            <div className="flex flex-col min-h-screen">
                {/* Navbar cố định ở trên cùng */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white">
                    <NavBar />
                </header>

                {/* Thêm padding-top để đẩy nội dung xuống dưới Navbar */}
                <div className="pt-22 flex h-screen">
                    <div className="max-h-screen">
                        <AppSidebar items={items} />
                    </div>
                    {/* Outlet chiếm phần còn lại */}
                    <main className="flex-1 p-6 bg-white">
                        <SidebarTrigger />
                        <Outlet />
                    </main>
                </div>
                {/*<Footer />*/}


                {/* Footer ở dưới cùng */}
            </div>
        </SidebarProvider>
    );
}

export default SidebarLayout;