import React from 'react';

const HeroImage = ({ imageSrc, altText }) => {
  return (
    <img
      src={imageSrc}
      alt={altText}
      className="h-auto w-full max-w-md rounded-xl object-contain shadow-lg md:max-w-lg lg:max-w-xl"
    />
  );
};

export default HeroImage;
