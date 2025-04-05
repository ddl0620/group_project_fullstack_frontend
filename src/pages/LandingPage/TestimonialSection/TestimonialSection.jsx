import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import TestimonialCard from './TestimonialCard';

const TestimonialSection = () => {
    const testimonials = [
        {
            image: '../../../../public/images/dr_tri_dang.jpg',
            name: 'Dr. Tri Dang',
            role: 'Event Organizer',
            feedback: '“EventApp made organizing my event so much easier. Highly recommend!”',
        },
        {
            image: '../../../../public/images/Dr_Tuan_Tran.jpg',
            name: 'Dr. Tuan Tran',
            role: 'Event Enthusiast',
            feedback: '“I found so many amazing events near me. Love this app!”',
        },
        {
            image: '../../../../public/images/dr_phong_ngo.jpg',
            name: 'Dr. Phong Ngo',
            role: 'Professional Speaker',
            feedback: '“The best platform for staying connected with attendees. A game-changer!”',
        },
        {
            image: '../../../../public/images/dr_ushik.jpg',
            name: 'Dr. Ushik Shrestha',
            role: 'Lecturer',
            feedback: '“EventApp is the best tool for managing events. Highly efficient!”',
        },

    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-neutral-900 mb-16 tracking-tight">
                    What Our Users Say
                </h2>
                <div className="relative">
                    <Swiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={30}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        pagination={{ clickable: true }}
                        navigation={{
                            prevEl: '.swiper-prev',
                            nextEl: '.swiper-next',
                        }}
                        className="w-full pb-12"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <TestimonialCard
                                    image={testimonial.image}
                                    name={testimonial.name}
                                    role={testimonial.role}
                                    feedback={testimonial.feedback}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <button
                        className="swiper-prev absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-12 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 z-10"
                    >
                        <svg
                            className="w-6 h-6 text-neutral-500 hover:text-neutral-700 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        className="swiper-next absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-12 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 z-10"
                    >
                        <svg
                            className="w-6 h-6 text-neutral-500 hover:text-neutral-700 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;