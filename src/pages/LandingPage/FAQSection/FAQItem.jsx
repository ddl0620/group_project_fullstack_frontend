import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm">
      <button
        className="flex w-full items-center justify-between px-6 py-4 text-left text-lg font-medium text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180 transform' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-4">
          <p className="whitespace-pre-line text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
