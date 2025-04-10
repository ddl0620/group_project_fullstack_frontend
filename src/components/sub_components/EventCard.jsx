import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({
    image,
    tags,
    location,
    title,
    venue,
    date,
    time,
    distance,
    rating,
    price,
    link,
    description,
    organizer,
    participantCount,
    endDate,
    endTime
}) {
    return (
        <div className="bg-white overflow-hidden">
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="h-48 w-full object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">
                    <Link to={link} className="text-gray-900 hover:text-blue-600">
                        {title}
                    </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-2">{venue}</p>
                <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-700">
                        {date} | {time}
                    </div>
                    <div className="text-sm text-gray-700">{distance}</div>
                </div>
                {description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {description}
                    </p>
                )}
                {participantCount > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                        {participantCount} participant{participantCount !== 1 ? 's' : ''}
                    </p>
                )}
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <svg
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="ml-1 text-sm text-gray-700">
                            {rating}
                        </span>
                    </div>
                    <div className="text-sm font-semibold">
                        {price === 'Free' ? 'Free' : `${price}€`}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
