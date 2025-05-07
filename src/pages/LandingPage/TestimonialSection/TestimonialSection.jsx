import { Star } from "lucide-react"

const TestimonialSection = () => {
  const testimonials = [
    {
      image: "public/images/dr_tri_dang.jpg",
      name: "Dr. Tri Dang",
      role: "Event Organizer",
      feedback:
        "EventApp has completely transformed how I organize conferences. The intuitive interface and powerful features have saved me countless hours of work. The analytics dashboard provides insights I never had access to before.",
      rating: 5,
    },
    {
      image: "public/images/Dr_Tuan_Tran.jpg",
      name: "Dr. Tuan Tran",
      role: "Event Enthusiast",
      feedback:
        "I've discovered so many amazing events through EventApp. The personalized recommendations are spot-on, and the discussion boards have helped me connect with like-minded people before events even start.",
      rating: 5,
    },
    {
      image: "public/images/dr_phong_ngo.jpg",
      name: "Dr. Phong Ngo",
      role: "Professional Speaker",
      feedback:
        "As a speaker, I love how EventApp helps me stay connected with my audience. The engagement tools are fantastic, and the analytics help me understand what resonates with attendees.",
      rating: 5,
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Loved by Event Professionals
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Join thousands of satisfied users who trust EventApp
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center">
          <div className="mb-4 flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-center text-lg font-medium text-gray-900">
            <span className="text-[#0071e3]">4.9/5</span> from over 10,000 reviews
          </p>
        </div>
      </div>

      {/* Apple-style decorative elements */}
      <div className="absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl"></div>
    </section>
  )
}

// Separate testimonial card component for cleaner code
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white/80 p-8 shadow-md backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center space-x-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mb-6 text-gray-600 italic">"{testimonial.feedback}"</p>
      <div className="flex items-center">
        <div className="mr-4 h-12 w-12 overflow-hidden rounded-full border-2 border-[#0071e3]/20">
          <img
            src={testimonial.image || "/placeholder.svg"}
            alt={testimonial.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>

      {/* Apple-style hover effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </div>
  )
}

export default TestimonialSection
