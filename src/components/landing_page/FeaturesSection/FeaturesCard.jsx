import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform">
            {icon}
            <h3 className="text-2xl font-semibold mb-4">{title}</h3>
            <p className="text-base text-neutral-600">{description}</p>
        </div>
    );
};

export default FeatureCard;