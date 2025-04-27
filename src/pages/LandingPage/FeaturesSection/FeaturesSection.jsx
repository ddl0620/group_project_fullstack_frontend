import React from 'react';
import FeatureCard from './FeaturesCard';
import {
  SparklesIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const FeaturesSection = () => {
  const features = [
    {
      icon: <SparklesIcon className="mx-auto mb-6 h-16 w-16 text-blue-500" />,
      title: 'Discover Events',
      description: 'Find events tailored to your interests and location.',
    },
    {
      icon: (
        <CheckCircleIcon className="mx-auto mb-6 h-16 w-16 text-green-500" />
      ),
      title: 'Organize Seamlessly',
      description:
        'Create and manage events with ease using our intuitive tools.',
    },
    {
      icon: (
        <ChatBubbleLeftRightIcon className="mx-auto mb-6 h-16 w-16 text-yellow-500" />
      ),
      title: 'Stay Connected',
      description: 'Engage with attendees and receive real-time updates.',
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-screen-xl px-6">
        <h2 className="font-inter mb-12 text-center text-4xl font-bold text-neutral-800 md:text-5xl">
          Why Choose <span className="text-neutral-900">Eventy?</span>
        </h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
