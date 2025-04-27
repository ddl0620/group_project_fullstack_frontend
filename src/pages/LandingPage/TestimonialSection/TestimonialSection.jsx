import { Marquee } from '@/components/magicui/marquee.js';

const TestimonialSection = () => {
  const testimonials = [
    {
      image: '/images/dr_tri_dang.jpg',
      name: 'Dr. Tri Dang',
      role: 'Event Organizer',
      feedback:
        '"EventApp made organizing my event so much easier. Highly recommend!"',
    },
    {
      image: '/images/Dr_Tuan_Tran.jpg',
      name: 'Dr. Tuan Tran',
      role: 'Event Enthusiast',
      feedback: '"I found so many amazing events near me. Love this app!"',
    },
    {
      image: '/images/dr_phong_ngo.jpg',
      name: 'Dr. Phong Ngo',
      role: 'Professional Speaker',
      feedback:
        '"The best platform for staying connected with attendees. A game-changer!"',
    },
    {
      image: '/images/dr_ushik.jpg',
      name: 'Dr. Ushik Shrestha',
      role: 'Lecturer',
      feedback:
        '"EventApp is the best tool for managing events. Highly efficient!"',
    },
  ];

  // Duplicate testimonials to ensure enough content for continuous scrolling
  const allTestimonials = [...testimonials, ...testimonials];

  // Split testimonials into two rows for better visual effect
  const firstRow = allTestimonials.slice(0, allTestimonials.length / 2);
  const secondRow = allTestimonials.slice(allTestimonials.length / 2);

  return (
    <section className="relative bg-white py-20">
      <div className="mx-auto max-w-screen-xl px-6">
        <h2 className="mb-16 text-center text-4xl font-bold tracking-tight text-neutral-800 md:text-5xl">
          What Our Users Say
        </h2>

        <div className="relative flex w-full flex-col items-center justify-center gap-8 overflow-hidden">
          {/* First row of testimonials */}
          <Marquee reverse={true} pauseOnHover className="[--duration:30s]">
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
  );
};

// Separate testimonial card component for cleaner code
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="mx-4 my-4 w-72 flex-shrink-0">
      <div className="flex h-full flex-col rounded-xl border border-neutral-100 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <img
          src={testimonial.image || '/placeholder.svg'}
          alt={testimonial.name}
          className="mx-auto mb-4 h-16 w-16 rounded-full border-2 border-blue-500 object-cover"
        />
        <h3 className="mb-2 text-center text-lg font-semibold text-neutral-900">
          {testimonial.name}
        </h3>
        <p className="mb-4 text-center text-sm text-neutral-600">
          {testimonial.role}
        </p>
        <p className="flex-grow text-center text-sm text-neutral-800 italic">
          {testimonial.feedback}
        </p>
      </div>
    </div>
  );
};

export default TestimonialSection;
