import { CalendarDays, Users, MessageSquare, BarChart } from "lucide-react"

const FeaturesShowcase = () => {
  const features = [
    {
      icon: CalendarDays,
      title: "Event Creation",
      description: "Create beautiful event pages with customizable templates, ticketing, and registration forms.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Users,
      title: "Attendee Management",
      description: "Manage registrations, send reminders, and track attendance with powerful tools.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: MessageSquare,
      title: "Discussion & Chat",
      description: "Foster community engagement with built-in discussion boards and real-time chat.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: BarChart,
      title: "Analytics & Insights",
      description: "Gain valuable insights with comprehensive analytics on attendance and engagement.",
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Everything You Need for Successful Events
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Powerful features designed to make event management effortless
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${feature.color} text-white`}
              >
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

export default FeaturesShowcase
