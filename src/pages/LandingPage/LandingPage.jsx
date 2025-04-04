import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import HeroSection from '../../components/landing_page/HeroSection/HeroSection';
import FeaturesSection from '../../components/landing_page/FeaturesSection/FeaturesSection';
import TestimonialSection from '../../components/landing_page/TestimonialSection/TestimonialSection';
import FAQSection from '../../components/landing_page/FAQSection/FAQSection';
import CallToActionSection from '../../components/landing_page/CallToActionSection/CallToActionSection';

function LandingPage() {
    return (
        <div className="bg-neutral-100">
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