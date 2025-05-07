const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Event",
      description:
        "Set up your event in minutes with our intuitive interface. Add details, upload images, and customize your event page.",
    },
    {
      number: "02",
      title: "Invite Attendees",
      description:
        "Share your event through social media, email, or generate a custom link. Track RSVPs and registrations in real-time.",
    },
    {
      number: "03",
      title: "Engage Your Audience",
      description: "Use discussion boards and chat to build excitement before, during, and after your event.",
    },
    {
      number: "04",
      title: "Analyze & Improve",
      description: "Review comprehensive analytics to understand attendee behavior and improve future events.",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            EventApp simplifies the entire event management process
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-[50%] top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#0071e3]/0 via-[#0071e3]/30 to-[#0071e3]/0 md:left-[15%] lg:left-[20%]"></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row">
                <div className="mb-6 flex items-center justify-center md:mb-0 md:w-[30%] lg:w-[40%]">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0071e3]/20 to-[#6c56f5]/20 blur-sm"></div>
                    <span className="relative text-2xl font-bold text-[#0071e3]">{step.number}</span>
                  </div>
                </div>
                <div className="md:w-[70%] lg:w-[60%]">
                  <h3 className="mb-3 text-2xl font-medium text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apple-style decorative elements */}
      <div className="absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl"></div>
    </section>
  )
}

export default HowItWorks
