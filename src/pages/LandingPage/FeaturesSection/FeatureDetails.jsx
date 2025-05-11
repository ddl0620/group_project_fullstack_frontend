import { CalendarPlus, MessageCircle, Users, BarChart3 } from "lucide-react"

const FeatureDetails = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f5f7] to-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Powerful Features for Every Need
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover how EventApp can transform your event management experience
          </p>
        </div>

        <div className="space-y-24">
          {/* Feature 1: Event Creation */}
          <FeatureRow
            icon={CalendarPlus}
            title="Create Stunning Events"
            description="Design beautiful event pages with our intuitive editor. Set up ticketing, registration forms, and customize every aspect of your event."
            image="/LandingPage/createEvent.png"
            imageAlt="Event Creation Interface"
            reverse={false}
            benefits={[
              "Drag-and-drop event page builder",
              "Customizable registration forms",
              "Multiple ticket types and pricing options",
              "Branded event pages that match your style",
            ]}
          />

          {/* Feature 2: Discussion & Chat */}
          <FeatureRow
            icon={MessageCircle}
            title="Foster Community Engagement"
            description="Build excitement and keep the conversation going with integrated discussion boards and real-time chat for all your events."
            image="/LandingPage/ui-element-chat.png"
            imageAlt="Discussion Interface"
            reverse={true}
            benefits={[
              "Pre-event discussion boards",
              "Live chat during events",
              "Topic categorization and moderation tools",
              "Direct messaging between attendees",
            ]}
          />

          {/* Feature 3: Attendee Management */}
          <FeatureRow
            icon={Users}
            title="Seamless Attendee Management"
            description="Track registrations, send automated reminders, and manage check-ins with our powerful attendee management tools."
            image="/LandingPage/event-mana.png"
            imageAlt="Attendee Management Interface"
            reverse={false}
            benefits={[
              "Real-time registration tracking",
              "Automated email reminders and notifications",
              "QR code check-in system",
              "Attendee grouping and tagging",
            ]}
          />

          {/* Feature 4: Analytics */}
          <FeatureRow
            icon={BarChart3}
            title="Comprehensive Analytics"
            description="Gain valuable insights with detailed analytics on attendance, engagement, and ticket sales to optimize your future events."
            image="/LandingPage/hero-dasboard.png"
            imageAlt="Analytics Dashboard"
            reverse={true}
            benefits={[
              "Real-time attendance tracking",
              "Engagement metrics and heatmaps",
              "Revenue and ticket sales reports",
              "Exportable data for custom analysis",
            ]}
          />
        </div>
      </div>

      {/* Apple-style decorative elements */}
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl"></div>
      <div className="absolute -right-32 top-32 h-64 w-64 rounded-full bg-gradient-to-l from-blue-100/30 to-purple-100/30 blur-3xl"></div>
    </section>
  )
}

const FeatureRow = ({ icon: Icon, title, description, image, imageAlt, reverse, benefits }) => {
  return (
    <div className={`flex flex-col items-center gap-12 lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""}`}>
      <div className="w-full lg:w-1/2">
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0071e3]/20 to-[#6c56f5]/20 opacity-70 blur"></div>
          <div className="relative overflow-hidden rounded-2xl bg-white/80 p-2 shadow-xl backdrop-blur-sm">
            <img src={image || "/placeholder.svg"} alt={imageAlt} className="h-auto w-full rounded-xl object-cover" />

            {/* Add floating UI elements for more visual interest */}
            <div className="absolute -bottom-4 right-8 w-24 rotate-6 rounded-lg bg-white/90 p-2 shadow-md backdrop-blur-md">
              <img src="/ui-element-stats.png" alt="UI Element" className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0071e3]/10 text-[#0071e3]">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-4 text-3xl font-semibold text-gray-900">{title}</h3>
        <p className="mb-6 text-lg text-gray-600">{description}</p>

        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0071e3]/10 text-[#0071e3]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FeatureDetails
