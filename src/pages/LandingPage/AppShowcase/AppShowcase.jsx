const AppShowcase = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f5f7] to-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            EventApp on Every Device
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Manage your events seamlessly across desktop, tablet, and mobile
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center md:flex-row">
          {/* Desktop */}
          <div className="relative z-20 w-full max-w-2xl">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0071e3]/20 to-[#6c56f5]/20 opacity-70 blur"></div>
              <div className="relative overflow-hidden rounded-2xl bg-white/80 p-2 shadow-xl backdrop-blur-sm">
                <img
                  src="public/LandingPage/desktop.png"
                  alt="EventApp on Desktop"
                  className="h-auto w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="relative z-10 -mt-16 ml-auto mr-8 w-1/4 md:mt-0">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#0071e3]/20 to-[#6c56f5]/20 opacity-70 blur"></div>
              <div className="relative overflow-hidden rounded-3xl bg-white/80 p-1 shadow-xl backdrop-blur-sm">
                <img
                  src="public/LandingPage/mobile.png"
                  alt="EventApp on Mobile"
                  className="h-auto w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="relative z-0 -mt-32 -ml-8 w-2/5 md:mt-16">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0071e3]/20 to-[#6c56f5]/20 opacity-70 blur"></div>
              <div className="relative overflow-hidden rounded-2xl bg-white/80 p-1 shadow-xl backdrop-blur-sm">
                <img
                  src="public/LandingPage/tablet.png"
                  alt="EventApp on Tablet"
                  className="h-auto w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* Desktop Feature */}
          <div className="rounded-xl bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <h3 className="mb-2 text-xl font-medium text-gray-900">Desktop Experience</h3>
            <p className="text-gray-600">
              Powerful event management tools with advanced analytics and customization options for professional
              organizers.
            </p>
          </div>

          {/* Mobile Feature */}
          <div className="rounded-xl bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <h3 className="mb-2 text-xl font-medium text-gray-900">Mobile App</h3>
            <p className="text-gray-600">
              On-the-go event management with real-time notifications and check-in capabilities for busy organizers.
            </p>
          </div>

          {/* Tablet Feature */}
          <div className="rounded-xl bg-white/80 p-6 shadow-md backdrop-blur-sm">
            <h3 className="mb-2 text-xl font-medium text-gray-900">Tablet Optimized</h3>
            <p className="text-gray-600">
              Perfect for event day operations with intuitive interfaces for registration desks and check-in stations.
            </p>
          </div>
        </div>
      </div>

      {/* Apple-style decorative elements */}
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl"></div>
      <div className="absolute -right-32 top-32 h-64 w-64 rounded-full bg-gradient-to-l from-blue-100/30 to-purple-100/30 blur-3xl"></div>
    </section>
  )
}

export default AppShowcase
