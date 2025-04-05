import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

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
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative">
            <div className="max-w-screen-xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-neutral-800 mb-16 tracking-tight">
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
                            <SwiperSlide key={index} className="min-h-[300px] flex items-stretch">
                                <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-blue-500"
                                    />
                                    <h3 className="text-lg font-semibold text-center mb-2 text-neutral-900">{testimonial.name}</h3>
                                    <p className="text-sm text-neutral-600 text-center mb-4">{testimonial.role}</p>
                                    <p className="text-sm text-neutral-800 text-center flex-grow italic">{testimonial.feedback}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <button
                        className="swiper-prev absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent border border-neutral-300 p-2 rounded-full shadow-md hover:bg-neutral-200 transition z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-neutral-800">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        className="swiper-next absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent border border-neutral-300 p-2 rounded-full shadow-md hover:bg-neutral-200 transition z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-neutral-800">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;