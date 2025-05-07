import FAQItem from "./FAQItem"

const FAQSection = () => {
  const faqs = [
    {
      question: "What is EventApp?",
      answer:
        "EventApp is a comprehensive platform that helps you discover, organize, and manage events effortlessly. Whether you're an attendee looking for exciting events or an organizer planning your next gathering, EventApp provides all the tools you need in one place.",
    },
    {
      question: "How much does it cost?",
      answer:
        "EventApp offers flexible pricing plans to suit different needs:\n\n- **Free Plan**: Ideal for individuals who want to explore events or manage small gatherings.\n- **Pro Plan**: $9.99/month, designed for event organizers who need advanced tools.\n- **Enterprise Plan**: Custom pricing tailored for large organizations and businesses.",
    },
    {
      question: "What features are included?",
      answer:
        "EventApp includes a wide range of features such as event creation and management, attendee tracking, discussion boards, real-time chat, analytics, ticketing, custom branding, email notifications, and much more. Our platform is constantly evolving with new features based on user feedback.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription at any time without any penalties. Once you cancel, you will retain access to your account and its features until the end of your current billing cycle.",
    },
    {
      question: "Is there customer support available?",
      answer:
        "EventApp provides 24/7 customer support to assist you with any issues or questions. Our support team is available via live chat, email, and phone to ensure you have the best experience possible.",
    },
  ]

  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">Find answers to common questions about EventApp</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center rounded-full bg-[#0071e3]/10 px-6 py-2 text-sm font-medium text-[#0071e3] transition-colors hover:bg-[#0071e3]/20"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
