import { useState } from 'react';
import { useSelector } from 'react-redux';
import { navbarItems } from './NavbarItem.js';
import { useAuth } from '../hooks/useAuth.js';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {LogOut, Menu, User, X} from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import { CustomDropdown } from '@/components/shared/CustomeDropdown.jsx';

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, role } = useSelector((state) => state.user);
    const { handleSignOut } = useAuth();
    const location = useLocation();
    const {user} = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Guest nav links (dùng cho sidebar trên mobile nếu cần)
    // Component One (dùng cho cả desktop và mobile)
    const One = ({ isMobile = false }) => {
        // Lọc navbarItems: Nếu đã đăng nhập, loại bỏ Sign In và Sign Up
        const filteredItems = isAuthenticated
            ? navbarItems.filter(
                  (item) => (item.path !== '/sign-in' && item.path !== '/sign-up')
              )
            : navbarItems;

        const ITEMS = filteredItems.map((item, index) => ({
            ...item,
            id: index + 1,
        }));

        const [isHover, setIsHover] = useState(null);

        return (
            <ul
                className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center`}
            >
                {ITEMS.map((item) => (
                    <Link key={item.id} to={item.path}>
                        <button
                            className="relative py-2 transition-colors duration-300 hover:!text-white"
                            onMouseEnter={() => setIsHover(item)}
                            onMouseLeave={() => setIsHover(null)}
                            style={{
                                color:
                                    location.pathname === item.path
                                        ? '#FFF'
                                        : '#888888',
                            }}
                        >
                            <div className="relative px-5 py-2">
                                {item.title}
                                {isHover?.id === item.id && (
                                    <motion.div
                                        layoutId="hover-bg"
                                        className="absolute right-0 bottom-0 left-0 h-full w-full bg-white/10"
                                        style={{
                                            borderRadius: 6,
                                        }}
                                    />
                                )}
                            </div>
                            {location.pathname === item.path && (
                                <motion.div
                                    layoutId="active"
                                    className="absolute right-0 bottom-0 left-0 h-0.5 w-full bg-white"
                                />
                            )}
                            {isHover?.id === item.id && (
                                <motion.div
                                    layoutId="hover"
                                    className="absolute right-0 bottom-0 left-0 h-0.5 w-full bg-white"
                                />
                            )}
                        </button>
                    </Link>
                ))}
            </ul>
        );
    };

    const dropdownMenu = [
        {
            label: 'Edit profile',
            icon: <User className="mr-2 h-4 w-4" />,
            onClick: () => {
                navigate("/profile/edit");
            },
        },
        {
            label: 'Sign out',
            icon: <LogOut className="mr-2 h-4 w-4" />,
            onClick: handleSignOut,
        },
    ]

    return (
        <nav className="border-b border-neutral-800 bg-neutral-950 text-neutral-100 shadow-sm">
            <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
                {/* Left: Brand + Nav */}
                <div className="flex items-center gap-10">
                    <Link
                        to="/"
                        className="text-xl font-semibold tracking-tight transition-colors hover:text-white"
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
                        <div className="flex items-center gap-4">
                            <CustomDropdown
                                children={
                                <CustomAvatar src={user?.avatar}
                                              alt={user?.name}
                                    fallbackText={user?.name}
                                />
                            }
                                dropDownLabel={'My Profile'}
                                items={dropdownMenu}
                            />
                        </div>
                    )}

                    {/* Burger menu (only visible on small screens) */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-1 md:hidden"
                    >
                        {menuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar (slides in from the right) */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-64 transform border-l border-neutral-800 bg-neutral-950 transition-transform duration-300 ease-in-out ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                } md:hidden`}
            >
                <div className="flex justify-end p-4">
                    <button onClick={() => setMenuOpen(false)}>
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="px-6">
                    <One isMobile={true} />
                </div>
            </div>

            {/* Overlay (visible when sidebar is open) */}
            {menuOpen && (
                <div
                    className="bg-opacity-30 fixed inset-0 z-40 bg-transparent backdrop-brightness-75 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </nav>
    );
}

export default NavBar;
