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
        <section className="py-20 bg-neutral-100">
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
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;