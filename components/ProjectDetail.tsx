import React, { useEffect, useRef } from 'react';
import { CaseStudy } from '../types';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

interface ProjectDetailProps {
  project: CaseStudy;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { language } = useLanguage();
  const t = getTranslation(language).project;

  // Data helpers to fallback to PT if EN is empty
  const getCategory = () => (language === 'en' && project.category_en) ? project.category_en : project.category;
  const getIndustry = () => (language === 'en' && project.industry_en) ? project.industry_en : project.industry;
  const getLocation = () => (language === 'en' && project.location_en) ? project.location_en : project.location;
  const getDescription = () => (language === 'en' && project.description_en) ? project.description_en : project.description;
  const getChallenge = () => (language === 'en' && project.challenge_en) ? project.challenge_en : project.challenge;

  useEffect(() => {
    // Stop body scroll
    document.body.style.overflow = 'hidden';
    
    const ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
            opacity: 0,
            duration: 0.5
        });
        
        // Stagger the reveal of the sections
        gsap.from(".reveal-item", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            stagger: 0.1,
            ease: "power3.out"
        });
    }, contentRef);

    return () => {
        // Restore body scroll
        document.body.style.overflow = '';
        ctx.revert();
    };
  }, []);

  const renderBlock = (block: any) => {
      // Text blocks keep a readable max-width but are now aligned to the left (start of grid)
      if (block.type === 'text') {
          const textContent = (language === 'en' && block.content_en) ? block.content_en : block.content;
          return (
             <div className="w-full px-4 md:px-10 reveal-item">
                <div className="max-w-[1800px] mx-auto w-full">
                    <div 
                        className="max-w-4xl w-full text-lg md:text-2xl leading-relaxed text-[#312E35] font-light rte-content"
                        dangerouslySetInnerHTML={{ __html: textContent }}
                    />
                </div>
             </div>
          );
      }

      // 2-col text also centers for readability
      if (block.type === '2-col-text') {
          let cols = { left: '', right: '' };
          try {
              // Check if we have english content, otherwise default
              const contentStr = (language === 'en' && block.content_en) ? block.content_en : block.content;
              cols = JSON.parse(contentStr);
          } catch (e) { console.error('Error parsing col content'); }

          return (
             <div className="w-full px-4 md:px-10 reveal-item">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 max-w-[1800px] mx-auto">
                     <div 
                        className="text-lg md:text-xl leading-relaxed text-[#312E35] font-light rte-content"
                        dangerouslySetInnerHTML={{ __html: cols.left }}
                     />
                     <div 
                        className="text-lg md:text-xl leading-relaxed text-[#312E35] font-light rte-content"
                        dangerouslySetInnerHTML={{ __html: cols.right }}
                     />
                 </div>
             </div>
          );
      }
      
      // Images and Videos go Full Width (minus small padding for grid alignment)
      if (block.type === 'image') {
          return (
            <div className="w-full px-0 md:px-4 reveal-item">
                <img src={block.content} alt="Project detail" className="w-full h-auto object-cover" />
            </div>
          );
      }
      
      if (block.type === 'video') {
          return (
            <div className="w-full px-0 md:px-4 reveal-item">
                <video src={block.content} controls className="w-full h-auto object-cover" />
            </div>
          );
      }

      return null;
  };

  return (
    <div 
      ref={containerRef} 
      data-lenis-prevent 
      className="fixed inset-0 z-[10000] bg-[#F3EFF9] overflow-y-auto w-full h-full"
    >
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 z-50 w-12 h-12 rounded-full border border-[#312E35] flex items-center justify-center hover:bg-[#312E35] hover:text-white transition-colors duration-300 bg-[#F3EFF9]"
      >
        <X size={24} />
      </button>

      {/* Main Content - Full Width */}
      <div ref={contentRef} className="w-full pb-20 md:pb-32">
        
        {/* 1. TITLE Header */}
        <div className="w-full px-4 md:px-10 pt-24 md:pt-32 pb-12 reveal-item">
            <span className="font-micro text-[#8C6EB7] mb-6 block text-sm md:text-base tracking-widest">{getCategory()}</span>
            <h1 className="font-display text-5xl md:text-8xl lg:text-9xl text-[#312E35] leading-[0.9]">{project.title}</h1>
        </div>

        {/* 2. HUGE COVER IMAGE */}
        {project.coverUrl && (
             <div className="w-full h-[60vh] md:h-[85vh] mb-16 md:mb-24 px-0 md:px-4 reveal-item">
                <img src={project.coverUrl} alt="Cover" className="w-full h-full object-cover" />
            </div>
        )}

        {/* 3. METADATA TABLE (Swiss Style) - Moved Below Cover */}
        <div className="px-4 md:px-10 mb-24 reveal-item">
            <div className="w-full max-w-[1800px] mx-auto border-t border-[#312E35] text-xs md:text-sm font-bold tracking-wider text-[#716C7A]">
                {/* Serviço */}
                <div className="flex flex-col md:flex-row justify-between py-6 border-b border-[#ACA4BC]">
                    <span className="uppercase w-full md:w-1/3 mb-2 md:mb-0">{t.service}</span>
                    <span className="text-[#312E35] uppercase md:text-right w-full md:w-2/3">{getCategory()}</span>
                </div>
                {/* Atuação */}
                <div className="flex flex-col md:flex-row justify-between py-6 border-b border-[#ACA4BC]">
                    <span className="uppercase w-full md:w-1/3 mb-2 md:mb-0">{t.industry}</span>
                    <span className="text-[#312E35] uppercase md:text-right w-full md:w-2/3">{getIndustry() || '—'}</span>
                </div>
                {/* Ano */}
                <div className="flex flex-col md:flex-row justify-between py-6 border-b border-[#ACA4BC]">
                    <span className="uppercase w-full md:w-1/3 mb-2 md:mb-0">{t.year}</span>
                    <span className="text-[#312E35] uppercase md:text-right w-full md:w-2/3">{project.year || '—'}</span>
                </div>
                {/* Localização */}
                <div className="flex flex-col md:flex-row justify-between py-6 border-b border-[#312E35]">
                    <span className="uppercase w-full md:w-1/3 mb-2 md:mb-0">{t.location}</span>
                    <span className="text-[#312E35] uppercase md:text-right w-full md:w-2/3">{getLocation() || '—'}</span>
                </div>
            </div>
        </div>

        {/* 4. DESCRIPTION & DETAILS */}
        <div className="px-4 md:px-10 mb-24 reveal-item">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full max-w-[1800px] mx-auto">
                <div>
                    <h2 className="font-display text-2xl md:text-3xl text-[#312E35] mb-8">{t.description_title}</h2>
                    <div className="text-lg md:text-2xl font-light text-[#312E35] leading-relaxed">
                        {getDescription()}
                    </div>
                </div>
                
                <div>
                    <h2 className="font-display text-2xl md:text-3xl text-[#312E35] mb-8">{t.details_title}</h2>
                    <div className="text-lg md:text-xl font-light text-[#716C7A] leading-relaxed whitespace-pre-line">
                        {getChallenge() || "—"}
                    </div>
                </div>
            </div>
        </div>

        {/* 5. BLOCKS (Images, Video, Text) */}
        <div className="w-full space-y-4 md:space-y-8">
            {project.blocks && project.blocks.length > 0 ? (
                project.blocks.map(block => (
                    <div key={block.id} className="w-full flex justify-center">
                        {renderBlock(block)}
                    </div>
                ))
            ) : null}
        </div>

        {/* Footer of Detail */}
        <div className="px-4 md:px-10 mt-32 reveal-item">
             <div className="border-t border-[#ACA4BC] pt-12 flex justify-between items-center max-w-[1800px] mx-auto">
                <div className="font-display text-2xl text-[#312E35]">{project.title}</div>
                <button onClick={onClose} className="font-micro hover:text-[#8C6EB7] transition-colors">{t.back}</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;