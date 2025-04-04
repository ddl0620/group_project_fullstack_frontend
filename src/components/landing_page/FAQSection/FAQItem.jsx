import React from 'react';

const FAQItem = ({ question, answer }) => {
    return (
        <details className="group border border-neutral-200 rounded-xl p-4">
            <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-neutral-800">
                {question}
                <span className="group-open:rotate-180 transition-transform">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-500"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </summary>
            <p className="mt-3 text-sm text-neutral-600">{answer}</p>
        </details>
    );
};

export default FAQItem;