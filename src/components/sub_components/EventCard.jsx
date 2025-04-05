import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

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
  link = "#", // Add a link prop for the redirection URL
}) => {
  return (
    <Link
      to={link} // Make the entire card clickable
      className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300 border border-gray-300"
    >
      {/* Image section with overlay */}
      <div className="relative h-56">
        <img
          src={image}
          alt="Event"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2 px-4 py-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-200 text-xs text-gray-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        {distance && (
          <span className="bg-gray-200 text-xs text-gray-700 px-2 py-1 rounded-full">
            {distance}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="px-4 pb-4">
        {/* Location */}
        <div className="font-semibold text-md text-black">{location}</div>
        {/* Venue */}
        <div className="text-sm text-gray-500">{venue}</div>

        {/* Date & Time */}
        <div className="text-sm text-gray-500 mt-1">
          {date} | {time}
        </div>

        {/* Rating and Price */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-sm text-yellow-600 font-semibold">
            ★ {rating}
          </div>
          <div className="text-md text-black font-semibold">Price {price}€</div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;