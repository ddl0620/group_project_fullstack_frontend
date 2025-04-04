import React from 'react';
import { Link } from 'react-router-dom';

function CallToActionSection() {
    return (
        <section className="bg-white text-neutral-900 py-16">
            <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
                {/* Text Content */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg md:text-xl mb-8 text-neutral-600">
                        Join EventApp today and take your events to the next level.
                    </p>
                    <Link
                        to="/sign-up"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition"
                    >
                        Sign Up Now
                    </Link>
                </div>
                {/* Image Slot */}
                <div className="md:w-1/2">
                    <img
                        src="/images/cta-image.png" // Replace with your image path
                        alt="Get Started"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}

export default CallToActionSection;