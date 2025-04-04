import React from 'react'

const HeroSection = () => {
  return (
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
                        src="/images/hero-image.png" // Replace with your image path
                        alt="EventApp Hero"
                        className="rounded-3xl shadow-2xl"
                    />
                </div>
            </div>
        </section>
    )
}

export default HeroSection