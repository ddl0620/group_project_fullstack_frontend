import React from 'react';
import HeroText from './HeroText';
import HeroImage from './HeroImage';
import { motion } from 'framer-motion'; // Import Framer Motion

const HeroSection = () => {
    return (
        <section className="bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
                {/* Text Content */}
                <HeroText
                    title="Welcome to"
                    subtitle="Discover, organize, and manage events effortlessly with a sleek and intuitive interface."
                    primaryLink={{ to: "/sign-up", text: "Get Started" }}
                    secondaryLink={{ to: "/events", text: "Explore Events" }}
                />

                {/* Image Content */}
                <HeroImage
                    imageSrc="../../../../public/images/apple-product.jpg"
                    altText="EventApp Hero"
                />
            </div>
        </section>
    );
};

export default HeroSection;