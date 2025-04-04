import React from 'react';
import FAQItem from './FAQItem';

const FAQSection = () => {
    const faqs = [
        {
            question: 'What is EventApp?',
            answer: 'EventApp is a platform that helps you discover, organize, and manage events effortlessly.',
        },
        {
            question: 'How much does it cost?',
            answer: 'We offer a free plan, a Pro plan for $9.99/month, and custom pricing for enterprises.',
        },
        {
            question: 'Can I cancel anytime?',
            answer: 'Yes, you can cancel your subscription at any time without any penalties.',
        },
        {
            question: 'Is there customer support available?',
            answer: 'Yes, we offer 24/7 customer support to assist you with any issues or questions.',
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-br from-white to-gray-100">
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