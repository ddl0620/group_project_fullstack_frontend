import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import HeroSection from './HeroSection/HeroSection';
import FeaturesSection from './FeaturesSection/FeaturesSection';
import TestimonialSection from './TestimonialSection/TestimonialSection';
import FAQSection from './FAQSection/FAQSection';
import CallToActionSection from './CallToActionSection/CallToActionSection';

function LandingPage() {
    return (
        <div className="bg-neutral-100 min-h-screen max-w-screen-xl mx-auto px-6 py-4 items-center justify-center">
            <HeroSection/>
            <FeaturesSection/>
            <TestimonialSection/>
            <FAQSection/>
            <CallToActionSection 
                title="Ready to Get Started?"
                description="Join EventApp today and take your events to the next level."
                buttonText="Sign Up Now"
                buttonLink="/sign-up"
            />

        </div>
    )
}

export default LandingPage;