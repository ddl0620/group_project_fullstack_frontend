import React from 'react';

const FAQItem = ({ question, answer }) => {
  return (
    <details className="group rounded-xl border border-neutral-200 p-4">
      <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-neutral-800">
        {question}
        <span className="transition-transform group-open:rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-5 w-5 text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </summary>
      <p className="mt-3 text-sm text-neutral-600">{answer}</p>
    </details>
  );
};

export default FAQItem;
