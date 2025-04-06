import React from 'react';

const HeroImage = ({ imageSrc, altText }) => {
    return (
        <img
            src={imageSrc}
            alt={altText}
            className="w-full h-auto max-w-md md:max-w-lg lg:max-w-xl object-contain rounded-xl shadow-lg"
        />
    );
};

export default HeroImage;