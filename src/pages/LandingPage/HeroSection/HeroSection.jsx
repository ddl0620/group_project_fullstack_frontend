import React from 'react';
import HeroText from './HeroText';
import HeroImage from './HeroImage';

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto flex h-screen max-w-screen-xl flex-col items-center gap-10 px-6 py-20 md:flex-row">
        {/* Text Content */}
        <HeroText
          title="Welcome to"
          subtitle="Discover, organize, and manage events effortlessly with a sleek and intuitive interface."
          primaryLink={{ to: '/sign-up', text: 'Get Started' }}
          secondaryLink={{ to: '/events', text: 'Explore Events' }}
        />

        {/* Image Content */}
        <div className="flex w-full justify-center md:w-1/2">
          <HeroImage
            imageSrc="../../../../public/images/apple-product.jpg"
            altText="EventApp Hero"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
