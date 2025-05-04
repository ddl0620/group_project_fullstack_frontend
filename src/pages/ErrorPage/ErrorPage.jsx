"use client"

import { useNavigate } from "react-router-dom"

const ErrorPage = () => {
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f7] p-6">
      <div className="max-w-md w-full backdrop-blur-xl bg-white/80 rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div className="px-8 pt-6 pb-2 border-b border-gray-200/50">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center space-y-6">
            <h1 className="text-[80px] leading-none font-medium text-gray-800">404</h1>

            <div className="space-y-4">
              <h2 className="text-xl font-medium text-gray-800">This page could not be found.</h2>

              <p className="text-gray-500">
                The page you're looking for doesn't exist or has been moved to another location.
              </p>

              <p className="text-sm text-gray-400 italic">
                "Even the most advanced search algorithms can't find pages that don't exist."
              </p>
            </div>

            <button
              onClick={handleGoBack}
              className="mt-4 px-6 py-2 bg-[#0071e3] text-white rounded-full font-medium text-sm hover:bg-[#0077ed] transition-all focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
