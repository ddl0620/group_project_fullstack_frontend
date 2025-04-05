import React from 'react';
import { Link } from 'react-router-dom';

const HeroText = ({ title, subtitle, primaryLink, secondaryLink }) => {
    return (
        <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                {title} <span className="text-blue-500">EventApp</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-neutral-600">{subtitle}</p>
            <div className="flex justify-center md:justify-start gap-4">
                <Link
                    to={primaryLink.to}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition"
                >
                    {primaryLink.text}
                </Link>
                <Link
                    to={secondaryLink.to}
                    className="bg-neutral-200 px-6 py-3 rounded-full font-medium hover:bg-neutral-300 transition"
                >
                    {secondaryLink.text}
                </Link>
            </div>
        </div>
    );
};

export default HeroText;