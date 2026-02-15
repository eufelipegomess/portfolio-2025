import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const { language } = useLanguage();
  const t = getTranslation(language).about;

  useEffect(() => {
    // Reset HTML for animation re-trigger on language change
    if(headlineRef.current) {
        headlineRef.current.innerHTML = t.text_1;
    }

    const ctx = gsap.context(() => {
      // Split text reveal effect
      const words = t.text_1.split(" ");
      if(headlineRef.current) {
          headlineRef.current.innerHTML = words.map(word => `<span class="word opacity-20 transition-opacity duration-300 inline-block mr-2">${word}</span>`).join("");
          
          ScrollTrigger.matchMedia({
            "(max-width: 767px)": function() {
                gsap.to(".word", {
                    opacity: 1,
                    stagger: 0.02,
                    scrollTrigger: {
                        trigger: headlineRef.current,
                        start: "top 90%",
                        end: "center 50%",
                        scrub: 0.5,
                    }
                });
            },
            "(min-width: 768px)": function() {
                gsap.to(".word", {
                    opacity: 1,
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: headlineRef.current,
                        start: "top 80%",
                        end: "bottom 40%", 
                        scrub: 1,
                    }
                });
            }
          });
      }

      gsap.fromTo(".about-card", 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
              trigger: ".cards-container",
              start: "top 90%",
              end: "bottom center",
              toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [language, t.text_1]);

  const cardsData = [
    t.cards.strategy,
    t.cards.support,
    t.cards.security
  ];

  return (
    <section ref={containerRef} id="sobre" className="relative py-32 px-6 md:px-20 min-h-screen flex flex-col justify-center bg-[#F3EFF9]">
      
      <div 
        className={`fixed inset-0 z-40 bg-[#312E35]/30 backdrop-blur-md transition-all duration-500 pointer-events-none ${hoveredCard !== null ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="max-w-7xl mx-auto mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-0">
        <div>
            <span className="font-micro text-[#8C6EB7] block mb-8">{t.label}</span>
            <p ref={headlineRef} className="font-display text-2xl md:text-3xl lg:text-4xl text-[#312E35] leading-tight uppercase mb-8">
              {t.text_1}
            </p>
            <p className="text-[#716C7A] text-lg font-light leading-relaxed">
              {t.text_2}
              <br/><br/>
              {t.text_3}
            </p>
        </div>
        
        <div className="relative w-full aspect-[3/4] md:aspect-square lg:aspect-[3/4] bg-gray-200 rounded-[4px] overflow-hidden">
            <img 
                src="https://i.imgur.com/k9Jb1qI.jpeg" 
                alt="Felipe Gomes" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
        </div>
      </div>

      <div className="cards-container grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full relative z-50">
        {cardsData.map((item, idx) => (
            <div 
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                    about-card p-10 bg-white border border-white/50 rounded-[4px] 
                    transition-all duration-500 ease-out cursor-default
                    ${hoveredCard === idx 
                        ? 'scale-105 shadow-2xl opacity-100 z-50' 
                        : hoveredCard !== null 
                            ? 'scale-95 opacity-40 blur-[2px]' 
                            : 'hover:shadow-xl'
                    }
                `}
            >
                <span className={`font-micro mb-4 block transition-colors duration-300 ${hoveredCard === idx ? 'text-[#8C6EB7]' : 'text-[#312E35]'}`}>
                    0{idx + 1}
                </span>
                <h3 className="font-display text-2xl mb-4 text-[#312E35]">{item.title}</h3>
                <p className="text-[#716C7A] font-light">{item.desc}</p>
            </div>
        ))}
      </div>
    </section>
  );
};

export default About;