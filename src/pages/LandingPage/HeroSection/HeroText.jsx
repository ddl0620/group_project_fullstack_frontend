import React from 'react';
import { Link } from 'react-router-dom';

const HeroText = ({ title, subtitle, primaryLink, secondaryLink }) => {
  return (
    <div className="font-inter text-center font-semibold md:w-1/2 md:text-left">
      <h1 className="mb-6 text-5xl leading-tight font-bold md:text-7xl">
        {title} <span className="text-blue-500">EventApp</span>
      </h1>
      <p className="mb-8 text-lg text-neutral-600 md:text-xl">{subtitle}</p>
      <div className="flex justify-center gap-4 md:justify-start">
        <Link
          to={primaryLink.to}
          className="rounded-full bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600"
        >
          {primaryLink.text}
        </Link>
        <Link
          to={secondaryLink.to}
          className="rounded-full bg-neutral-200 px-6 py-3 font-medium transition hover:bg-neutral-300"
        >
          {secondaryLink.text}
        </Link>
      </div>
    </div>
  );
};

export default HeroText;
