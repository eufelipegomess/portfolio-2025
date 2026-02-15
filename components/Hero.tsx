import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isArrowHovered, setIsArrowHovered] = useState(false);
  
  const { language } = useLanguage();
  const t = getTranslation(language).hero;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal animation
      gsap.from(imageRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 2,
        ease: "power2.out"
      });

      // Text reveal
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
      });

      // Badge reveal
      gsap.from(badgeRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: "power2.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, [language]); 

  const handleContact = () => {
    window.open("https://wa.me/5571999278413?text=Olá,%20vim%20através%20do%20site%20e%20gostaria%20de%20conhecer%20mais%20sobre%20os%20projetos%20de%20marca!", "_blank");
  };

  const handleScrollToCases = () => {
    document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section ref={heroRef} className="relative min-h-screen w-full flex flex-col lg:flex-row bg-[#F3EFF9] overflow-hidden">
      
      {/* Left Side: Image (Loose, Blended, Full Height) */}
      <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-auto order-1 flex items-end justify-center lg:justify-start overflow-hidden">
         {/* 
            Using mix-blend-multiply to blend the image background with the section background.
            object-cover ensures it fills the height.
         */}
         <img 
           ref={imageRef}
           src="https://i.imgur.com/fkRvGdK.jpeg" 
           alt="Brand Atmosphere" 
           className="w-full h-full object-cover mix-blend-multiply opacity-90"
         />
         
         {/* Floating Badge */}
         <div 
           ref={badgeRef}
           className="absolute bottom-10 left-6 md:left-12 bg-white/80 backdrop-blur-md px-6 py-4 rounded-[4px] shadow-xl border border-white/40 z-20"
         >
           <div className="flex items-center gap-3">
             <img 
                src="https://i.imgur.com/JbSHnvO.png" 
                alt="Clients" 
                className="h-8 w-auto object-contain"
             />
             <span className="font-micro text-[#312E35] text-xs tracking-wider">{t.badge}</span>
           </div>
         </div>
      </div>

      {/* Right Side: Copy */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 lg:py-32 order-2 relative z-10">
        <h1 ref={titleRef} className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-[#312E35] mb-10 leading-[0.85] tracking-tight">
          {t.title_1} <br className="hidden md:block" /> <span className="text-[#8C6EB7] whitespace-nowrap">{t.title_2}</span><br/>
          {t.title_3} <br/>{t.title_4}
        </h1>

        <div className="flex flex-col items-start gap-8 border-t border-[#ACA4BC] pt-10 max-w-xl">
          <p className="text-[#716C7A] text-lg md:text-xl font-light leading-relaxed">
            {t.subtitle}
          </p>
          
          <div className="flex flex-wrap gap-4 items-center mt-2">
             <MagneticButton onClick={handleContact}>
                {t.cta}
             </MagneticButton>
             
             <button 
                onClick={handleScrollToCases}
                onMouseEnter={() => setIsArrowHovered(true)}
                onMouseLeave={() => setIsArrowHovered(false)}
                className={`
                  relative rounded-[4px] border border-[#312E35] overflow-hidden transition-all duration-500 ease-out
                  flex items-center justify-center group w-[56px] h-[56px]
                  active:bg-[#312E35]
                  ${isArrowHovered ? 'w-[180px] bg-[#312E35]' : 'bg-transparent'}
                `}
             >
                <div className={`
                   absolute flex items-center justify-center transition-all duration-300
                   ${isArrowHovered ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}
                `}>
                  <ArrowDownRight className={`w-6 h-6 transition-colors duration-300 text-[#312E35] group-active:text-[#8C6EB7]`} />
                </div>

                <div className={`
                  absolute flex items-center gap-2 whitespace-nowrap transition-all duration-300
                  ${isArrowHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                `}>
                  <span className="font-micro text-white ml-2">{t.explore}</span>
                  <ArrowRight className="w-5 h-5 text-[#8C6EB7]" />
                </div>
             </button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;