import React from 'react';

const HeroImage = ({ imageSrc, altText }) => {
    return (
        <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl"></div>
            <img
                src={imageSrc}
                alt={altText}
                className="rounded-3xl shadow-2xl"
            />
        </div>
    );
};

export default HeroImage;