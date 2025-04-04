import React from 'react';

const TestimonialCard = ({ image, name, role, feedback }) => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center transform hover:-translate-y-1 transition-all duration-200 border border-gray-100">
            <div className="relative w-16 h-16 mx-auto mb-6">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                />
            </div>
            <p className="text-base text-neutral-600 mb-4 font-light leading-relaxed">{feedback}</p>
            <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
            <p className="text-sm text-neutral-500">{role}</p>
        </div>
    );
};

export default TestimonialCard;