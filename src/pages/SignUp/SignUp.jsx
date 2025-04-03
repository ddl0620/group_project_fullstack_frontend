import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpUser } from '../../services/AuthService.js';
import {useAuth} from "@/hooks/useAuth.js";

function Register() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'attendee',
    });
    const [error, setError] = useState(null);
    const {handleSignUp} = useAuth();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async () => {
        await handleSignUp(userData, setError);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm rounded bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-bold">Register</h2>
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Enter your password"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                    >
                        <option value="organizer">Organizer</option>
                        <option value="attendee">Attendee</option>
                    </select>
                </div>
                <button
                    onClick={handleRegister}
                    className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                    Register
                </button>
                <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <a
                        href="/sign-in"
                        className="text-blue-500 hover:underline"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Register;
