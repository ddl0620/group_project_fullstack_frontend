import { useState } from 'react';
import {useAuth} from "../../hooks/useAuth.js";

function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const {handleSignIn} = useAuth();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        await handleSignIn(credentials, setError);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-red-100">
            <div className="w-full max-w-sm rounded bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-bold">Login</h2>
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
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
                        value={credentials.password}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        placeholder="Enter your password"
                    />
                </div>
                <button
                    onClick={handleLogin}
                    className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                    Login
                </button>
                <p className="mt-4 text-center">
                    Don't have an account?{' '}
                    <a
                        href="/sign-up"
                        className="text-blue-500 hover:underline"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
