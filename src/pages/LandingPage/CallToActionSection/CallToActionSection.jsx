import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionSection = ({ title, description, buttonText, buttonLink }) => {
    return (
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 text-neutral-900 py-20 relative">
            <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 relative z-10">
                {/* Text Content */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-5xl md:text-6xl font-extrabold mb-6">{title}</h2>
                    <p className="text-lg md:text-xl mb-8 text-neutral-600">{description}</p>
                    <Link
                        to={buttonLink}
                        className="bg-blue-500 text-white px-8 py-4 rounded-full font-medium shadow-md transition-transform duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 hover:shadow-lg"
                    >
                        {buttonText}
                    </Link>
                </div>

                {/* Icon on the Right */}
                <div className="md:w-1/2 relative flex justify-center items-center">
                    <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center shadow-lg group">
                        {/* Calendar Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-16 h-16 text-blue-500 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-6"
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