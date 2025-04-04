import { useState } from 'react';
import { useSelector } from 'react-redux';
import { navbarItems } from './NavbarItem.js';
import { useAuth } from "../hooks/useAuth.js";
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Icons for burger menu

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, role } = useSelector((state) => state.user);
    const { handleSignOut } = useAuth();

    const userLabel = role === 'admin' ? 'Admin Panel' : 'Logged in as User';

    // Guest nav links
    const guestNav = (
        <ul className="flex flex-col md:flex-row gap-4 text-sm">
            {navbarItems.map((item, index) => (
                <li key={index}>
                    <a
                        href={item.path}
                        className="hover:text-white text-neutral-400 transition-colors block py-2 md:py-0"
                        onClick={() => setMenuOpen(false)} // Close sidebar on link click
                    >
                        {item.title}
                    </a>
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

    return (
        <nav className="bg-neutral-950 text-neutral-100 border-b border-neutral-800 shadow-sm">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
                {/* Left: Brand + Nav */}
                <div className="flex items-center gap-10">
                    <Link
                        to="/home"
                        className="text-lg font-semibold tracking-tight hover:text-white transition-colors"
                    >
                        EventApp
                    </Link>

                    {/* Desktop Nav (horizontal layout for larger screens) */}
                    <div className="hidden md:block">
                        {isAuthenticated ? userInfo : guestNav}
                    </div>
                </div>

                {/* Right: Logout + Burger */}
                <div className="flex items-center gap-4">
                    {isAuthenticated && (
                        <button
                            onClick={handleSignOut}
                            className="text-sm px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition"
                        >
                            Logout
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
                    {!isAuthenticated && guestNav}
                </div>
            </div>

            {/* Overlay (visible when sidebar is open) */}
            {menuOpen && (
                    <div
                        className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-brightness-75  md:hidden z-40"
                        onClick={() => setMenuOpen(false)} // Close sidebar on overlay click
                    />
                )
            }
        </nav>
    );
}

export default NavBar;