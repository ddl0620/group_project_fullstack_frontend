import { ArrowRight } from "lucide-react"
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-16 md:flex-row md:justify-between">
          {/* Text Content */}
          <div className="w-full text-center md:w-1/2 md:text-left">
            <div className="mb-6 inline-flex items-center rounded-full bg-[#0071e3]/10 px-4 py-2 text-sm font-medium text-[#0071e3]">
              New version
            </div>
            <h1 className="mb-4 text-5xl font-semibold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
                <span className="text-[#0071e3] font-bold">Eventify</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 md:pr-8">
              The all-in-one platform for creating, managing, and discovering events. Seamlessly organize, engage, and
              connect with attendees like never before.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                to="/event/create"
                className="group flex items-center justify-center rounded-full bg-[#0071e3] px-8 py-3 text-center text-sm font-medium text-white shadow-lg transition-all hover:bg-[#0077ed] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2"
              >
                Start Creating Events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/event"
                className="rounded-full border border-gray-300 bg-white px-8 py-3 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Explore Events
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4 md:justify-start">
              <div className="flex -space-x-2">
                <img src="/LandingPage/user1.jpg" alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
                <img src="/LandingPage/user2.webp" alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
                <img src="/LandingPage/user3.webp" alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">10,000+</span> event organizers trust us
              </p>
            </div>
          </div>

          {/* Image Content */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0071e3]/20 to-[#6c56f5]/20 opacity-70 blur"></div>
              <div className="relative overflow-hidden rounded-2xl bg-white/80 p-2 shadow-xl backdrop-blur-sm">
                <img
                  src="/LandingPage/hero-dasboard.png"
                  alt="EventApp Dashboard"
                  className="h-auto w-full rounded-xl object-cover"
                />
                {/* Add floating UI elements for more visual interest */}
                <div className="absolute -right-6 top-1/4 w-32 rotate-6 rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur-md">
                  <img src="/LandingPage/ui-element-chat.png" alt="Calendar UI" className="w-full" />
                </div>
                <div className="absolute -left-6 bottom-1/4 w-32 -rotate-6 rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur-md">
                  <img src="/LandingPage/ui-element-chat.png" alt="Chat UI" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apple-style decorative elements */}
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl"></div>
      <div className="absolute -right-32 top-32 h-64 w-64 rounded-full bg-gradient-to-l from-blue-100/30 to-purple-100/30 blur-3xl"></div>
    </section>
  )
}

export default HeroSection
