import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_STEPS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

gsap.registerPlugin(ScrollTrigger);

const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { language } = useLanguage();
  const t = getTranslation(language).process;

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const section = sectionRef.current;
    
    if (!scrollContainer || !section) return;

    const ctx = gsap.context(() => {
      
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": function() {
            const totalWidth = scrollContainer.scrollWidth;
            const windowWidth = window.innerWidth;
            const scrollAmount = totalWidth - windowWidth;

            gsap.to(scrollContainer, {
                x: -scrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: `+=${scrollAmount + 500}`, 
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

            gsap.to(section, {
                backgroundColor: "#EBE6F2",
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                }
            });

            const numbers = gsap.utils.toArray<HTMLElement>('.process-number');
            numbers.forEach((num) => {
                gsap.fromTo(num, 
                    { color: "#EBE5F6", backgroundImage: "none" },
                    {
                        color: "transparent",
                        backgroundImage: "radial-gradient(circle, #8C6EB7 25%, transparent 26%)",
                        backgroundSize: "8px 8px",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: num,
                            containerAnimation: gsap.getTweensOf(scrollContainer)[0] as gsap.core.Tween,
                            start: "left 90%",
                            end: "right 10%",
                            toggleActions: "play reverse play reverse",
                        }
                    }
                );
            });
        },

        "(max-width: 767px)": function() {
            const items = gsap.utils.toArray<HTMLElement>('.process-item-mobile');
            items.forEach((item) => {
                gsap.from(item, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                    }
                });
            });

            const numbers = gsap.utils.toArray<HTMLElement>('.process-number');
            numbers.forEach((num) => {
                gsap.fromTo(num, 
                    { color: "#EBE5F6", backgroundImage: "none" },
                    {
                        color: "transparent",
                        backgroundImage: "radial-gradient(circle, #8C6EB7 25%, transparent 26%)",
                        backgroundSize: "8px 8px",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: num,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play reverse play reverse",
                        }
                    }
                );
            });
        } 
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [language]); // Re-run if language changes dimensions

  return (
    <section ref={sectionRef} className="relative transition-colors duration-500 bg-white md:bg-transparent">
      <div ref={triggerRef} className="w-full flex flex-col justify-center min-h-screen py-20 md:py-0 md:h-screen md:overflow-hidden">
        
        <div className="px-6 md:px-20 mb-12 md:absolute md:top-20 md:left-0 md:z-20 w-full">
          <h2 className="font-display text-4xl md:text-6xl text-[#312E35]">
            {t.title_top} <br/>{t.title_bottom}
            <span className="block font-sans font-light text-xl text-[#716C7A] mt-2 capitalize tracking-normal">{t.subtitle}</span>
          </h2>
        </div>

        <div 
          ref={scrollContainerRef} 
          className="flex flex-col md:flex-row gap-12 md:gap-20 px-6 md:px-20 w-full md:w-fit items-start md:items-center mt-10 md:mt-0"
        >
          {PROCESS_STEPS.map((step) => (
            <div key={step.id} className="process-item-mobile relative w-full md:w-[600px] group flex-shrink-0">
              <span className="process-number absolute -top-10 md:-top-20 left-0 md:-left-10 text-[120px] md:text-[250px] font-display font-bold text-[#EBE5F6] select-none z-0 transition-all duration-300 leading-none">
                {step.number}
              </span>
              
              <div className="relative z-10 p-6 md:p-8 border-l border-[#8C6EB7] bg-white/50 md:bg-white/5 backdrop-blur-sm mt-16 md:mt-0 ml-4 md:ml-0">
                <h3 className="font-display text-3xl md:text-5xl text-[#312E35] mb-4">
                    {language === 'en' && step.title_en ? step.title_en : step.title}
                </h3>
                <p className="text-[#716C7A] text-base md:text-lg font-light leading-relaxed">
                    {language === 'en' && step.description_en ? step.description_en : step.description}
                </p>
              </div>
            </div>
          ))}
          
          <div className="hidden md:block w-20 md:w-40 flex-shrink-0"></div> 
        </div>

      </div>
    </section>
  );
};

export default Process;