import { useSelector } from 'react-redux';
import { navbarItems } from './NavbarItem.js';
import {useAuth} from "../hooks/useAuth.js";

function NavBar() {
    const { isAuthenticated, role } = useSelector((state) => state.user);
    const {handleSignOut} = useAuth();
    return (
        <nav className="">
            {isAuthenticated ? (
                <>
                    {role === 'admin' ? (
                        <span>Admin Panel</span>
                    ) : (
                        <span>You are logged in. You are user</span>
                    )}
                    <button className={'bg-red-500'} onClick={handleSignOut}>
                        Logout
                    </button>
                </>
            ) : (
                <div>
                    <ul className="flex gap-4 bg-blue-500">
                        {navbarItems.map((item, index) => (
                            <li key={index}>
                                <a href={item.path}>{item.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
