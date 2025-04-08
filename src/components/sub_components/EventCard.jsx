import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const EventCard = ({
    image,
    tags = [],
    location,
    venue,
    date,
    time,
    distance,
    rating,
    price,
    link = '#', // Add a link prop for the redirection URL
}) => {
    return (
        <Link
            to={link} // Make the entire card clickable
            className="relative w-full max-w-sm overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
        >
            {/* Image section with overlay */}
            <div className="relative h-56">
                <img
                    src={image}
                    alt="Event"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Tag pills */}
            <div className="flex flex-wrap gap-2 px-4 py-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700"
                    >
                        {tag}
                    </span>
                ))}
                {distance && (
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
                        {distance}
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="px-4 pb-4">
                {/* Location */}
                <div className="text-md font-semibold text-black">
                    {location}
                </div>
                {/* Venue */}
                <div className="text-sm text-gray-500">{venue}</div>

                {/* Date & Time */}
                <div className="mt-1 text-sm text-gray-500">
                    {date} | {time}
                </div>

                {/* Rating and Price */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center text-sm font-semibold text-yellow-600">
                        ★ {rating}
                    </div>
                    <div className="text-md font-semibold text-black">
                        Price {price}€
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
