import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CaseStudy } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

gsap.registerPlugin(ScrollTrigger);

interface CasesProps {
  cases: CaseStudy[];
  onViewProject: (project: CaseStudy) => void;
}

const Cases: React.FC<CasesProps> = ({ cases, onViewProject }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const { language } = useLanguage();
  const t = getTranslation(language).cases;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        xPercent: -30, 
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom", 
          end: "bottom center", 
          scrub: 0.5 
        }
      });

      const cards = gsap.utils.toArray<HTMLElement>('.case-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, 
          { 
            y: 100, 
            opacity: 0,
            clipPath: "inset(100% 0 0 0)"
          },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0 0 0)", 
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%", 
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cases" className="py-32 w-full overflow-hidden relative">
      <div className="mb-24 w-full whitespace-nowrap">
        <h2 ref={titleRef} className="font-display text-[12vw] md:text-[15vw] leading-[0.8] text-[#E1D7EF] pl-10">
          {t.title}
        </h2>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {cases.map((project) => (
          <div 
            key={project.id} 
            onClick={() => onViewProject(project)}
            className="case-card group cursor-pointer flex flex-col"
          >
            <div className="relative overflow-hidden w-full aspect-[4/3] bg-gray-200 rounded-sm">
              <img 
                src={project.coverUrl} 
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-[#8C6EB7]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-white/90 backdrop-blur text-[#312E35] font-micro px-6 py-3 rounded-[4px] transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                  {t.view_project}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-start border-b border-[#ACA4BC] pb-4">
              <div>
                <span className="font-micro text-[#8C6EB7] block mb-2">
                    {language === 'en' && project.category_en ? project.category_en : project.category}
                </span>
                <h3 className="font-display text-4xl text-[#312E35]">{project.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cases;