import { Calendar, MapPin, Users, MessageSquare } from 'lucide-react';

const DiscussionHeader = ({ event }) => {
    return (
        <div className="border-b border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {event.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="mr-1 h-4 w-4" />
                            {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Users className="mr-1 h-4 w-4" />
                            {event.attendees} attendees
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {event.discussionCount} discussions
                        </div>
                    </div>
                </div>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                    New Discussion
                </button>
            </div>
        </div>
    );
};

export default DiscussionHeader;
