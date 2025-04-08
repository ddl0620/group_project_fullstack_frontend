import { useState } from 'react';
import { useSelector } from 'react-redux';
import { navbarItems } from './NavbarItem.js';
import { useAuth } from "../hooks/useAuth.js";
import { Link, useLocation } from 'react-router-dom'; // Thêm useLocation
import { Menu, X } from 'lucide-react'; // Icons for burger menu
import { motion } from "framer-motion";
import {CustomAvatar} from "@/components/shared/CustomAvatar.jsx";
import {CustomDropdown} from "@/components/shared/CustomeDropdown.jsx"; // Import Framer Motion

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, role } = useSelector((state) => state.user);
    const { handleSignOut } = useAuth();
    const location = useLocation(); // Lấy đường dẫn hiện tại

    const userLabel = role === 'admin' ? 'Admin Panel' : 'Logged in as User';

    // Guest nav links (dùng cho sidebar trên mobile nếu cần)
    const guestNav = (
        <ul className="flex flex-col md:flex-row gap-4 text-sm">
            {navbarItems.map((item, index) => (
                <li key={index}>
                    <Link
                        to={item.path}
                        className="hover:text-white text-neutral-400 transition-colors block py-2 md:py-0"
                        onClick={() => setMenuOpen(false)} // Close sidebar on link click
                    >
                        {item.title}
                    </Link>
                </li>
            ))}
        </ul>
    );

    // User info label
    const userInfo = (
        <span className="text-sm text-neutral-400">
            {userLabel}
        </span>
    );

    // Component One (dùng cho cả desktop và mobile)
    const One = ({ isMobile = false }) => {
        const ITEMS = navbarItems.map((item, index) => ({
            ...item,
            id: index + 1,
        }));

        const [isHover, setIsHover] = useState(null);

        return (
            <ul className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center`}>
                {isAuthenticated ? (
                    // Nếu đã đăng nhập, hiển thị userInfo
                    <li className="py-2 px-5">
                        {/*<CustomAvatar/>*/}
                    </li>
                ) : (
                    // Nếu chưa đăng nhập, hiển thị các mục điều hướng
                    ITEMS.map((item) => (
                        <Link key={item.id} to={item.path}>
                            <button
                                className="py-2 relative duration-300 transition-colors hover:!text-white"
                                onMouseEnter={() => setIsHover(item)} // Hiệu ứng hover
                                onMouseLeave={() => setIsHover(null)}
                                style={{
                                    color: location.pathname === item.path ? "#FFF" : "#888888", // Active dựa trên đường dẫn
                                }}
                            >
                                <div className="px-5 py-2 relative">
                                    {item.title}
                                    {isHover?.id === item.id && (
                                        <motion.div
                                            layoutId="hover-bg"
                                            className="absolute bottom-0 left-0 right-0 w-full h-full bg-white/10"
                                            style={{
                                                borderRadius: 6,
                                            }}
                                        />
                                    )}
                                </div>
                                {location.pathname === item.path && (
                                    <motion.div
                                        layoutId="active"
                                        className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-white"
                                    />
                                )}
                                {isHover?.id === item.id && (
                                    <motion.div
                                        layoutId="hover"
                                        className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-white"
                                    />
                                )}
                            </button>
                        </Link>
                    ))
                )}
            </ul>
        );
    };

    return (
        <nav className="bg-neutral-950 text-neutral-100 border-b border-neutral-800 shadow-sm">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
                {/* Left: Brand + Nav */}
                <div className="flex items-center gap-10">
                    <Link
                        to="/"
                        className="text-xl font-semibold tracking-tight hover:text-white transition-colors"
                    >
                        EventApp
                    </Link>

                    {/* Desktop Nav (dùng component One) */}
                    <div className="hidden md:block">
                        <One isMobile={false} />
                    </div>
                </div>

                {/* Right: Logout + Burger */}
                <div className="flex items-center gap-4">
                    {isAuthenticated && (
                        <button
                            onClick={() => {}}
                            className="text-sm px-4 py-2 rounded-2xl border border-neutral-700 hover:bg-neutral-800 transition"
                        >
                            <CustomDropdown children={<CustomAvatar/>}/>
                        </button>
                    )}

                    {/* Burger menu (only visible on small screens) */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-1"
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar (slides in from the right) */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-neutral-950 border-l border-neutral-800 transform transition-transform duration-300 ease-in-out z-50 ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                } md:hidden`}
            >
                <div className="flex justify-end p-4">
                    <button onClick={() => setMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="px-6">
                    <One isMobile={true} /> {/* Dùng component One cho mobile */}
                </div>
            </div>

            {/* Overlay (visible when sidebar is open) */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-brightness-75 md:hidden z-40"
                    onClick={() => setMenuOpen(false)} // Close sidebar on overlay click
                />
            )}
        </nav>
    );
}

export default NavBar;