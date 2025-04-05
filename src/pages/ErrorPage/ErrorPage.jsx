import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
            <div className="max-w-md text-center">
                <img
                    src="https://southerncrossremovals.com.au/img/noclue.png"
                    alt="404 Ghost"
                    className="mx-auto mb-4 w-48"
                />

                <h1 className="mb-2 text-7xl font-bold text-black-500">404</h1>
                <p className="mb-8 text-gray-400">Sorry, the page not found</p>

                <button
                    onClick={handleGoBack}
                    className="rounded-full bg-gray-800 px-8 py-2 text-white transition-colors hover:bg-black"
                >
                    BACK TO HOME
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
