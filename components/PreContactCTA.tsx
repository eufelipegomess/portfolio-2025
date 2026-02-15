import React from 'react';
import MagneticButton from './MagneticButton';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const PreContactCTA: React.FC = () => {
  const { language } = useLanguage();
  const t = getTranslation(language).cta_section;

  const handleContact = () => {
    window.open("https://wa.me/5571999278413?text=Olá,%20vim%20através%20do%20site%20e%20gostaria%20de%20conhecer%20mais%20sobre%20os%20projetos%20de%20marca!", "_blank");
  };

  return (
    <section className="py-32 px-6 md:px-20 bg-[#312E35] text-white flex flex-col items-center text-center">
      <div className="max-w-4xl">
        <h2 className="font-display text-4xl md:text-6xl mb-8 leading-tight">
          {t.title_1} <span className="text-[#8C6EB7]">{t.title_2}</span> {t.title_3} <span className="text-[#8C6EB7]">{t.title_4}</span> {t.title_5}
        </h2>
        <p className="text-[#ACA4BC] text-xl font-light mb-12 max-w-2xl mx-auto">
          {t.text}
        </p>
        <MagneticButton onClick={handleContact} className="bg-[#1a191d] text-white hover:bg-[#8C6EB7] hover:text-white border border-white/20">
          {t.button}
        </MagneticButton>
      </div>
    </section>
  );
};

export default PreContactCTA;