import { Link } from 'react-router-dom' // Commented out as requested

const CallToActionSection = ({ title, description, buttonText, buttonLink }) => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0071e3] to-[#42a4ff] p-1">
          <div className="rounded-2xl bg-white/10 p-12 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
              <p className="mb-8 text-lg text-white/90">{description}</p>

              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  to={buttonLink}
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium text-[#0071e3] shadow-lg transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0071e3]"
                  // Replace with Link when ready
                  // <Link to={buttonLink} className="...">
                >
                  {buttonText}
                </Link>
                {/*<a*/}
                {/*  href="/demo"*/}
                {/*  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0071e3]"*/}
                {/*>*/}
                {/*  Request a Demo*/}
                {/*</a>*/}
              </div>

              <div className="mt-8 flex items-center justify-center space-x-4">
                <div className="flex -space-x-2">
                  <img src="/LandingPage/user1.jpg" alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
                  <img src="/LandingPage/user2.webp" alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
                  <img src="/LandingPage/user3.webp" alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
                </div>
                <p className="text-sm text-white/90">
                  Join <span className="font-medium">10,000+</span> event organizers today
                </p>
              </div>
            </div>
          </div>

          {/* Apple-style decorative elements */}
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
        </div>
      </div>
    </section>
  )
}

export default CallToActionSection
