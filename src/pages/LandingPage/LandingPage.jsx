import React from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import HeroSection from './HeroSection/HeroSection';
import FeaturesSection from './FeaturesSection/FeaturesSection';
import TestimonialSection from './TestimonialSection/TestimonialSection';
import FAQSection from './FAQSection/FAQSection';
import CallToActionSection from './CallToActionSection/CallToActionSection';

function LandingPage() {
    // Animation variants for fade-in effect
    const fadeIn = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <div className="bg-neutral-100 min-h-screen max-w-screen-xl mx-auto px-6 py-4 items-center justify-center">
            {/* Hero Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeIn}
            >
                <HeroSection />
            </motion.div>

            {/* Features Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeIn}
            >
                <FeaturesSection />
            </motion.div>

            {/* Testimonial Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeIn}
            >
                <TestimonialSection />
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeIn}
            >
                <FAQSection />
            </motion.div>

            {/* Call to Action Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeIn}
            >
                <CallToActionSection
                    title="Ready to Get Started?"
                    description="Join EventApp today and take your events to the next level."
                    buttonText="Sign Up Now"
                    buttonLink="/sign-up"
                />
            </motion.div>
        </div>
    );
}

export default LandingPage;