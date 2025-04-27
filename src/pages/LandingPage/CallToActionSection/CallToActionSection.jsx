import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionSection = ({
  title,
  description,
  buttonText,
  buttonLink,
}) => {
  return (
    <section className="relative bg-white bg-gradient-to-br py-20 text-neutral-900">
      <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col items-center gap-10 px-6 md:flex-row">
        {/* Text Content */}
        <div className="text-center md:w-1/2 md:text-left">
          <h2 className="mb-6 text-5xl font-bold md:text-6xl">{title}</h2>
          <p className="mb-8 text-lg text-neutral-600 md:text-xl">
            {description}
          </p>
          <Link
            to={buttonLink}
            className="rounded-full bg-blue-500 px-8 py-4 font-medium text-white shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
          >
            {buttonText}
          </Link>
        </div>

        {/* Icon on the Right */}
        <div className="relative flex items-center justify-center md:w-1/2">
          <div className="group flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 shadow-lg">
            {/* Calendar Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-16 w-16 text-blue-500 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
