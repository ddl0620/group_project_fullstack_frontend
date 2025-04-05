import React from 'react';
import FeatureCard from './FeaturesCard';
import { SparklesIcon, CheckCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const FeaturesSection = () => {
    const features = [
        {
            icon: <SparklesIcon className="w-16 h-16 text-blue-500 mx-auto mb-6" />,
            title: 'Discover Events',
            description: 'Find events tailored to your interests and location.',
        },
        {
            icon: <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-6" />,
            title: 'Organize Seamlessly',
            description: 'Create and manage events with ease using our intuitive tools.',
        },
        {
            icon: <ChatBubbleLeftRightIcon className="w-16 h-16 text-yellow-500 mx-auto mb-6" />,
            title: 'Stay Connected',
            description: 'Engage with attendees and receive real-time updates.',
        },
    ];

    return (
        <section className="py-16 bg-neutral-100">
            <div className="max-w-screen-xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-neutral-800">
                    Why Choose <span className="text-neutral-900">EventApp?</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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