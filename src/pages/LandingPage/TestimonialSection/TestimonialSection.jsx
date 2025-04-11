import {Marquee} from "@/components/magicui/marquee.js";


const TestimonialSection = () => {
    const testimonials = [
        {
            image: "/images/dr_tri_dang.jpg",
            name: "Dr. Tri Dang",
            role: "Event Organizer",
            feedback: '"EventApp made organizing my event so much easier. Highly recommend!"',
        },
        {
            image: "/images/Dr_Tuan_Tran.jpg",
            name: "Dr. Tuan Tran",
            role: "Event Enthusiast",
            feedback: '"I found so many amazing events near me. Love this app!"',
        },
        {
            image: "/images/dr_phong_ngo.jpg",
            name: "Dr. Phong Ngo",
            role: "Professional Speaker",
            feedback: '"The best platform for staying connected with attendees. A game-changer!"',
        },
        {
            image: "/images/dr_ushik.jpg",
            name: "Dr. Ushik Shrestha",
            role: "Lecturer",
            feedback: '"EventApp is the best tool for managing events. Highly efficient!"',
        },
    ]

    // Duplicate testimonials to ensure enough content for continuous scrolling
    const allTestimonials = [...testimonials, ...testimonials]

    // Split testimonials into two rows for better visual effect
    const firstRow = allTestimonials.slice(0, allTestimonials.length / 2)
    const secondRow = allTestimonials.slice(allTestimonials.length / 2)

    return (
        <section className="py-20 bg-white relative">
            <div className="max-w-screen-xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-neutral-800 mb-16 tracking-tight">
                    What Our Users Say
                </h2>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-8">
                    {/* First row of testimonials */}
                    <Marquee  reverse={true}  pauseOnHover className="[--duration:30s]">
                        {firstRow.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </Marquee>

                    {/* Second row of testimonials (reverse direction) */}

                    {/* Gradient overlays for smooth edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
                </div>
            </div>
        </section>
    )
}

// Separate testimonial card component for cleaner code
const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="w-72 mx-4 flex-shrink-0 my-4">
            <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-100">
                <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-blue-500 object-cover"
                />
                <h3 className="text-lg font-semibold text-center mb-2 text-neutral-900">{testimonial.name}</h3>
                <p className="text-sm text-neutral-600 text-center mb-4">{testimonial.role}</p>
                <p className="text-sm text-neutral-800 text-center flex-grow italic">{testimonial.feedback}</p>
            </div>
        </div>
    )
}

export default TestimonialSection
