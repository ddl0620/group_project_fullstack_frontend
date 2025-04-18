
import { useState } from "react"
import { Search } from "lucide-react"

const EventSidebar = ({ events, selectedEventId, onEventSelect }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Event Discussions</h2>
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredEvents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <li
                key={event.id}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedEventId === event.id ? "bg-blue-50" : ""
                }`}
                onClick={() => onEventSelect(event)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{event.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.discussionCount} discussions
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="mt-1 text-xs text-gray-500 truncate">{event.location}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">No events found</div>
        )}
      </div>
    </div>
  )
}

export default EventSidebar
