import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
const EventsPreview = () => {
  const events = [
    {
      id: 1,
      title: "Vesak 2025",
      date: "Oct 15-17, 2023",
      location: "San Francisco, CA",
      attendees: 1200,
      image: "/LandingPage/eventpreview1.jpg",
      category: "Social",
      categoryColor: "bg-blue-500",
    },
    {
      id: 2,
      title: "Day of the Liberation of the South and National Reunification",
      date: "Nov 5-7, 2023",
      location: "Austin, TX",
      attendees: 5000,
      image: "/LandingPage/eventpreview2.webp",
      category: "Social",
      categoryColor: "bg-purple-500",
    },
    {
      id: 3,
      title: "Business Workshop",
      date: "Sep 25, 2023",
      location: "New York, NY",
      attendees: 300,
      image: "/LandingPage/networking.webp",
      category: "Business",
      categoryColor: "bg-amber-500",
    },
  ]

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              Discover Amazing Events
            </h2>
            <p className="max-w-2xl text-lg text-gray-600">
              Browse through thousands of events or create your own in minutes
            </p>
          </div>
          <a
            href="/sign-up"
            className="group flex items-center rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            View All Events
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

const EventCard = ({ event }) => {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <div
          className={`absolute left-4 top-4 z-10 rounded-full ${event.categoryColor} px-3 py-1 text-xs font-medium text-white`}
        >
          {event.category}
        </div>
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="mb-3 text-xl font-medium text-gray-900">{event.title}</h3>
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-[#0071e3]" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2 h-4 w-4 text-[#0071e3]" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="mr-2 h-4 w-4 text-[#0071e3]" />
            <span>{event.attendees} attendees</span>
          </div>
        </div>
        <Link
          to={`/sign-in`}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#0071e3]/10 px-4 py-2 text-sm font-medium text-[#0071e3] transition-colors hover:bg-[#0071e3]/20"
        >
          View Event Details
        </Link>
      </div>
    </div>
  )
}

export default EventsPreview
