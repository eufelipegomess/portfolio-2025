import React, { useState } from 'react';
import { Testimonial } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

interface FeedbacksProps {
  testimonials: Testimonial[];
}

const Feedbacks: React.FC<FeedbacksProps> = ({ testimonials }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useLanguage();
  const t = getTranslation(language).feedbacks;

  // Ensure we have data to display
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [];

  if (displayTestimonials.length === 0) return null;

  return (
    <section 
      id="feedbacks"
      className="py-24 bg-[#312E35] text-[#F3EFF9] overflow-hidden relative cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Custom Cursor for this section */}
      <div 
         className="fixed pointer-events-none z-50 text-white font-serif text-6xl opacity-0 transition-opacity duration-300 mix-blend-difference"
         style={{ 
             opacity: isHovered ? 1 : 0, 
             left: 'var(--mouse-x)', 
             top: 'var(--mouse-y)',
             transform: 'translate(-50%, -50%)'
         }}
      >
        "
      </div>

      <div className="px-6 md:px-20 mb-12">
        <span className="font-micro text-[#8C6EB7]">{t.label}</span>
        <h2 className="mt-4 text-3xl md:text-4xl max-w-xl font-light">
          {t.title}
        </h2>
      </div>

      <div className="flex whitespace-nowrap overflow-hidden">
        <div className={`flex animate-marquee ${isHovered ? 'paused' : ''}`}>
          {[...displayTestimonials, ...displayTestimonials].map((item, idx) => (
            <div 
                key={`${item.id}-${idx}`} 
                className="w-[85vw] md:w-[750px] px-8 md:px-16 border-r border-[#716C7A]/30 flex-shrink-0 flex flex-col justify-between min-h-[300px] py-8"
            >
               <p className="font-display text-xl md:text-2xl text-white whitespace-normal leading-relaxed">
                 "{language === 'en' && item.text_en ? item.text_en : item.text}"
               </p>
               <div className="mt-8">
                 <p className="font-bold text-[#8C6EB7]">{item.author}</p>
                 <p className="font-micro text-[#716C7A]">{item.company}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 40s linear infinite; /* Slower animation for better readability */
        }
        .paused {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Feedbacks;