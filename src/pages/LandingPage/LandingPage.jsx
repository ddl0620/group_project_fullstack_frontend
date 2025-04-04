import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="bg-neutral-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-gray-100 to-white text-neutral-900">
                <div className="max-w-screen-xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
                    {/* Text Content */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                            Welcome to <span className="text-blue-500">EventApp</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-neutral-600">
                            Discover, organize, and manage events effortlessly with a sleek and intuitive interface.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <Link
                                to="/sign-up"
                                className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/events"
                                className="bg-neutral-200 px-6 py-3 rounded-full font-medium hover:bg-neutral-300 transition"
                            >
                                Explore Events
                            </Link>
                        </div>
                    </div>
                    {/* Image Slot */}
                    <div className="md:w-1/2 relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl"></div>
                        <img
                            src="../../../public/images/—Pngtree—business office calendar event plan_5304257.png" // Replace with your image path
                            alt="EventApp Hero"
                            className="rounded-3xl shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-neutral-50">
                <div className="max-w-screen-xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
                        Why Choose <span className="text-blue-500">EventApp?</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform">
                            <img
                                src="/images/feature1.png" // Replace with your image path
                                alt="Discover Events"
                                className="w-20 h-20 mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold mb-4">Discover Events</h3>
                            <p className="text-base text-neutral-600">
                                Find events tailored to your interests and location.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform">
                            <img
                                src="/images/feature2.png" // Replace with your image path
                                alt="Organize Seamlessly"
                                className="w-20 h-20 mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold mb-4">Organize Seamlessly</h3>
                            <p className="text-base text-neutral-600">
                                Create and manage events with ease using our intuitive tools.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform">
                            <img
                                src="/images/feature3.png" // Replace with your image path
                                alt="Stay Connected"
                                className="w-20 h-20 mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold mb-4">Stay Connected</h3>
                            <p className="text-base text-neutral-600">
                                Engage with attendees and receive real-time updates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gradient-to-br from-gray-100 to-white">
                <div className="max-w-screen-xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
                        What Our Users Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
                            <p className="text-lg italic text-neutral-600 mb-6">
                                "EventApp made organizing my event so much easier. Highly recommend!"
                            </p>
                            <h3 className="text-xl font-semibold">- Nguyen Khanh Vy -</h3>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
                            <p className="text-lg italic text-neutral-600 mb-6">
                                "I found so many amazing events near me. Love this app!"
                            </p>
                            <h3 className="text-xl font-semibold">- Nguyen Hoang Phuong Anh -</h3>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
                            <p className="text-lg italic text-neutral-600 mb-6">
                                "The best platform for staying connected with attendees. A game-changer!"
                            </p>
                            <h3 className="text-xl font-semibold">- Dr. Phong Ngo -</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gradient-to-br from-white to-gray-100">
                <div className="max-w-screen-xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">What is EventApp?</h3>
                            <p className="text-sm text-neutral-600">
                                EventApp is a platform that helps you discover, organize, and manage events effortlessly.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">How much does it cost?</h3>
                            <p className="text-sm text-neutral-600">
                                We offer a free plan, a Pro plan for $9.99/month, and custom pricing for enterprises.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Can I cancel anytime?</h3>
                            <p className="text-sm text-neutral-600">
                                Yes, you can cancel your subscription at any time without any penalties.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="bg-gradient-to-br from-white to-gray-100 text-neutral-900 py-20">
                <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
                    {/* Text Content */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg md:text-xl mb-8 text-neutral-600">
                            Join EventApp today and take your events to the next level.
                        </p>
                        <Link
                            to="/sign-up"
                            className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition"
                        >
                            Sign Up Now
                        </Link>
                    </div>
                    {/* Image Slot */}
                    <div className="md:w-1/2 relative">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl"></div>
                        <img
                            src="/images/cta-image.png" // Replace with your image path
                            alt="Get Started"
                            className="rounded-3xl shadow-2xl"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage;