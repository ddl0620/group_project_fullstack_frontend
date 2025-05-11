const EventTypes = () => {
  const eventTypes = [
    {
      title: "Conferences",
      description: "Professional gatherings with speakers, workshops, and networking opportunities.",
      image: "/LandingPage/conference-event.webp",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Workshops",
      description: "Interactive sessions focused on learning and skill development.",
      image: "/LandingPage/workshop.webp",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Concerts",
      description: "Music performances and entertainment events for large audiences.",
      image: "/LandingPage/concert.webp",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Networking",
      description: "Social gatherings designed to build professional connections.",
      image: "/LandingPage/networking.webp",
      color: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Create Any Type of Event
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            EventApp supports a wide range of event formats to suit your needs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {eventTypes.map((type, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/80 shadow-md backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-80`}></div>
                <img
                  src={type.image || "/placeholder.svg"}
                  alt={type.title}
                  className="h-full w-full object-cover mix-blend-overlay transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-medium text-gray-900">{type.title}</h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventTypes
