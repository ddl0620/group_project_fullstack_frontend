import { motion } from 'framer-motion';
import HeroSection from './HeroSection/HeroSection';
import FeaturesShowcase from './FeaturesSection/FeaturesShowcase';
import HowItWorks from './HowItWorks/HowItWorks';
import EventsPreview from './EventsPreview/EventsPreview';
import TestimonialSection from './TestimonialSection/TestimonialSection';
import FAQSection from './FAQSection/FAQSection';
import CallToActionSection from './CallToActionSection/CallToActionSection';
import FeatureDetails from './FeaturesSection/FeatureDetails';
import AppShowcase from './AppShowcase/AppShowcase';
// Import the EventTypes component
import EventTypes from './EventTypes/EventTypes';

function LandingPage() {
  // Animation variants for subtle fade-in effect (Apple-style animations are subtle)
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Apple-style spring curve
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <HeroSection />
      </motion.div>

      {/* Features Showcase */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <FeaturesShowcase />
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <HowItWorks />
      </motion.div>

      {/* Event Types */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <EventTypes />
      </motion.div>

      {/* Events Preview */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <EventsPreview />
      </motion.div>

      {/* Feature Details */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <FeatureDetails />
      </motion.div>

      {/* App Showcase */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <AppShowcase />
      </motion.div>

      {/* Testimonial Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <TestimonialSection />
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <FAQSection />
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <CallToActionSection
          title="Ready to Transform Your Events?"
          description="Join thousands of event organizers who are creating unforgettable experiences with EventApp."
          buttonText="Get Started — It's Free"
          buttonLink="/sign-up"
        />
      </motion.div>
    </div>
  );
}

export default LandingPage;
