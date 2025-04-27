import React from 'react';

const TestimonialCard = ({ image, name, role, feedback }) => {
  return (
    <div className="transform rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-200 hover:-translate-y-1">
      <div className="relative mx-auto mb-6 h-16 w-16">
        <img
          src={image}
          alt={name}
          className="h-full w-full rounded-full border-2 border-gray-200 object-cover"
        />
      </div>
      <p className="mb-4 text-base leading-relaxed font-light text-neutral-600">
        {feedback}
      </p>
      <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
      <p className="text-sm text-neutral-500">{role}</p>
    </div>
  );
};

export default TestimonialCard;
