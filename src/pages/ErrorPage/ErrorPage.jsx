import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f7] p-6">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-xl">
        <div className="border-b border-gray-200/50 px-8 pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]"></div>
            <div className="h-3 w-3 rounded-full bg-[#febc2e]"></div>
            <div className="h-3 w-3 rounded-full bg-[#28c840]"></div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6 text-center">
            <h1 className="text-[80px] leading-none font-medium text-gray-800">
              404
            </h1>

            <div className="space-y-4">
              <h2 className="text-xl font-medium text-gray-800">
                This page could not be found.
              </h2>

              <p className="text-gray-500">
                The page you're looking for doesn't exist or has been moved to
                another location.
              </p>

              <p className="text-sm text-gray-400 italic">
                "Even the most advanced search algorithms can't find pages that
                don't exist."
              </p>
            </div>

            <button
              onClick={handleGoBack}
              className="mt-4 rounded-full bg-[#0071e3] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#0077ed] focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 focus:outline-none"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
