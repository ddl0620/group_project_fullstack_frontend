import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-lg transition-transform hover:scale-105">
      {icon}
      <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
      <p className="text-base text-neutral-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
