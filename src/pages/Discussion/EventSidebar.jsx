import { useState } from 'react';
import { Search } from 'lucide-react';

const EventSidebar = ({ events, selectedEventId, onEventSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-full w-80 flex-col border-r border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Event Discussions
                </h2>
                <div className="relative mt-4">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                key={event._id}
                                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                                    selectedEventId === event.id
                                        ? 'bg-blue-50'
                                        : ''
                                }`}
                                onClick={() => onEventSelect(event)}
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="truncate text-sm font-medium text-gray-900">
                                            {event.title}
                                        </h3>
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {event.discussionCount} discussions
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {new Date(
                                            event.date
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-gray-500">
                                        {event.location}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        No events found
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventSidebar;
