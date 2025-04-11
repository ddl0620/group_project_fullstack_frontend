import React from 'react';
import FAQItem from './FAQItem';

const FAQSection = () => {
    const faqs = [
        {
            question: 'What is EventApp?',
            answer: 'EventApp is a platform that helps you discover, organize, and manage events effortlessly. Whether you are an attendee looking for exciting events to join or an organizer planning your next big event, EventApp provides all the tools you need in one place. From ticketing and attendee management to event promotion and analytics, EventApp simplifies the entire process, allowing you to focus on creating memorable experiences.',
        },
        {
            question: 'How much does it cost?',
            answer: 'EventApp offers flexible pricing plans to suit different needs:\n\n- **Free Plan**: Ideal for individuals who want to explore events or manage small gatherings. Includes basic features like event discovery and RSVP management.\n- **Pro Plan**: $9.99/month, designed for event organizers who need advanced tools such as ticketing, attendee analytics, and custom branding.\n- **Enterprise Plan**: Custom pricing tailored for large organizations and businesses that require additional features like API integrations, dedicated support, and advanced reporting. Contact our sales team for more details.',
        },
        {
            question: 'Can I cancel anytime?',
            answer: 'Yes, you can cancel your subscription at any time without any penalties. Once you cancel, you will retain access to your account and its features until the end of your current billing cycle. After that, your account will revert to the Free Plan, and you will no longer be charged. If you decide to return, you can easily reactivate your subscription and pick up where you left off.',
        },
        {
            question: 'Is there customer support available?',
            answer: 'Absolutely! EventApp provides 24/7 customer support to assist you with any issues or questions. Our support team is available via live chat, email, and phone to ensure you have the best experience possible. Whether you need help setting up your event, troubleshooting technical issues, or understanding analytics, our dedicated team is here to help. We also offer a comprehensive Help Center with guides, FAQs, and tutorials to help you get started.',
        },
        {
            question: 'How do I create an event?',
            answer: 'Creating an event on EventApp is simple and intuitive:\n\n1. Log in to your EventApp account.\n2. Click on the "Create Event" button on your dashboard.\n3. Fill in the event details, such as the event name, date, time, location, and description.\n4. Add images, videos, or promotional materials to make your event stand out.\n5. Set up ticketing options, including free or paid tickets, and configure attendee limits.\n6. Publish your event and share it with your audience via social media, email, or a custom event page.\n7. Monitor registrations and manage attendees directly from your dashboard.',
        },
        {
            question: 'Can I track attendee registrations?',
            answer: 'Yes, EventApp provides powerful tools to track attendee registrations in real-time. You can view detailed analytics, including the number of tickets sold, attendee demographics, and engagement metrics. This data helps you understand your audience better and optimize your event strategy. Additionally, you can export attendee lists, send reminders, and manage check-ins seamlessly using our platform.',
        },
        {
            question: 'Is EventApp secure?',
            answer: 'Yes, security is a top priority at EventApp. We use industry-standard encryption to protect your data and ensure that all transactions are secure. Our platform is compliant with GDPR and other data protection regulations, giving you peace of mind when managing sensitive information. We also conduct regular security audits and updates to safeguard against potential threats.',
        },
        {
            question: 'Does EventApp support virtual events?',
            answer: 'Yes, EventApp is designed to support both in-person and virtual events. You can host webinars, live streams, and hybrid events seamlessly using our platform. Features like live Q&A, polls, and chat rooms help you engage with your audience in real-time. EventApp also integrates with popular virtual event tools like Zoom, Microsoft Teams, and Google Meet to provide a smooth experience for both organizers and attendees.',
        },
        {
            question: 'How do I get started with EventApp?',
            answer: 'Getting started with EventApp is quick and easy:\n\n1. Sign up for a free account on our website.\n2. Explore the platform and familiarize yourself with its features.\n3. Start discovering events near you or create your own event using the intuitive dashboard.\n4. If you need help, our support team is available to guide you through the process. You can also check out our Help Center for step-by-step tutorials and FAQs.',
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-br bg-white">
            <div className="max-w-screen-xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;