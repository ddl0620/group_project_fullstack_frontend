import { CalendarDays, Users, BarChart, Globe } from "lucide-react"

const FeaturesSection = () => {
  const features = [
    {
      icon: CalendarDays,
      title: "Event Management",
      description:
        "Create and manage events with an intuitive interface. Set dates, locations, and customize event details with ease.",
    },
    {
      icon: Users,
      title: "Attendee Tracking",
      description:
        "Monitor registrations, send reminders, and manage check-ins seamlessly with our powerful attendee management tools.",
    },
    {
      icon: BarChart,
      title: "Analytics & Insights",
      description:
        "Gain valuable insights with comprehensive analytics. Track ticket sales, attendee demographics, and engagement metrics.",
    },
    {
      icon: Globe,
      title: "Virtual Events",
      description:
        "Host webinars, live streams, and hybrid events with integrated tools for Q&A, polls, and interactive sessions.",
    },
  ]

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">Powerful Features</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Everything you need to create exceptional event experiences
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur-sm transition-all hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0071e3]/10 text-[#0071e3]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>

              {/* Apple-style hover effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
