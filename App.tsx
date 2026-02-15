import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

import Hero from './components/Hero';
import Cases from './components/Cases';
import Feedbacks from './components/Feedbacks';
import About from './components/About';
import Process from './components/Process';
import Contact from './components/Contact';
import Admin from './components/Admin';
import ProjectDetail from './components/ProjectDetail';
import PreContactCTA from './components/PreContactCTA';

import { INITIAL_CASES, INITIAL_TESTIMONIALS } from './constants';
import { CaseStudy, Testimonial } from './types';
import { loadCasesFromDB, saveCasesToDB, loadTestimonialsFromDB, saveTestimonialsToDB } from './utils/db';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { getTranslation } from './utils/translations';

// Extract inner component to use Hook
const AppContent: React.FC = () => {
  const [cases, setCases] = useState<CaseStudy[]>(INITIAL_CASES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { language, toggleLanguage } = useLanguage();
  const t = getTranslation(language).nav;

  useEffect(() => {
    const initData = async () => {
      try {
        const savedCases = await loadCasesFromDB();
        const savedTestimonials = await loadTestimonialsFromDB();
        
        if (savedCases && savedCases.length > 0) {
          setCases(savedCases);
        } else {
            // Legacy check (optional)
            try {
                const legacyData = localStorage.getItem('felipe_portfolio_cases');
                if (legacyData) {
                    const parsed = JSON.parse(legacyData);
                    if (Array.isArray(parsed)) {
                        setCases(parsed);
                        localStorage.removeItem('felipe_portfolio_cases');
                    }
                }
            } catch (e) {}
        }

        if (savedTestimonials && savedTestimonials.length > 0) {
            setTestimonials(savedTestimonials);
        }

      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoaded(true);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const saveData = async () => {
      try {
        await saveCasesToDB(cases);
        await saveTestimonialsToDB(testimonials);
      } catch (e) {
        console.error("Failed to save data to DB", e);
      }
    };
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [cases, testimonials, isLoaded]);

  useEffect(() => {
    const path = window.location.pathname;
    // Check for admin route on load
    if (path === '/admin' || path === '/admin/') {
      setShowLogin(true);
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);

        if(cursorDotRef.current && cursorOutlineRef.current) {
            cursorDotRef.current.style.left = `${clientX}px`;
            cursorDotRef.current.style.top = `${clientY}px`;
            
            gsap.to(cursorOutlineRef.current, {
                x: clientX,
                y: clientY,
                duration: 0.15,
                ease: "power2.out"
            });
        }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
        gsap.set(mobileMenuRef.current, { display: 'flex' });
        gsap.to(mobileMenuRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    } else {
        document.body.style.overflow = '';
        gsap.to(mobileMenuRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                if (mobileMenuRef.current) {
                    gsap.set(mobileMenuRef.current, { display: 'none' });
                }
            }
        });
    }
  }, [isMobileMenuOpen]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "123") {
        setShowLogin(false);
        setShowAdmin(true);
        setPasswordInput("");
        setIsMobileMenuOpen(false);
        // Clear URL without refresh for cleaner look
        window.history.pushState({}, '', '/');
    } else {
        alert("Senha incorreta");
    }
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  if (!isLoaded) {
      return <div className="h-screen w-full bg-[#F3EFF9] flex items-center justify-center font-display text-[#312E35]">CARREGANDO...</div>;
  }

  return (
    <div className="antialiased bg-[#F3EFF9]">
      <div ref={cursorDotRef} className="cursor-dot hidden lg:block pointer-events-none z-[9999]"></div>
      <div ref={cursorOutlineRef} className="cursor-outline hidden lg:block pointer-events-none z-[9999]" style={{ top: 0, left: 0, transform: 'translate(-50%, -50%)' }}></div>

      <nav 
        className={`fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-[200] text-white transition-all duration-300 ${isMobileMenuOpen ? 'mix-blend-normal' : 'mix-blend-difference'}`}
      >
        <div className="relative z-50">
            <svg className="h-5 md:h-6 w-auto" viewBox="0 0 231 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_logo)">
                    <path d="M0 23.6077V0.628919C0 0.498675 0.104195 0.390759 0.238161 0.390759H17.2145C17.3448 0.390759 17.4527 0.494954 17.4527 0.628919V5.04233C17.4527 5.17258 17.3485 5.28049 17.2145 5.28049H6.04333C5.91308 5.28049 5.80517 5.38469 5.80517 5.51865V9.80182C5.80517 9.93207 5.90936 10.04 6.04333 10.04H15.313C15.4432 10.04 15.5511 10.1442 15.5511 10.2781V14.4943C15.5511 14.6246 15.4469 14.7325 15.313 14.7325H6.04333C5.91308 14.7325 5.80517 14.8367 5.80517 14.9707V23.6151C5.80517 23.7454 5.70097 23.8533 5.567 23.8533H0.238161C0.107917 23.8533 0 23.7491 0 23.6151V23.6077Z" fill="currentColor"/>
                    <path d="M19.5291 23.6077V0.628904C19.5291 0.49866 19.6332 0.390743 19.7672 0.390743H37.0711C37.2013 0.390743 37.3092 0.494939 37.3092 0.628904V4.94557C37.3092 5.07581 37.205 5.18373 37.0711 5.18373H25.5724C25.4421 5.18373 25.3342 5.28792 25.3342 5.42189V9.14687C25.3342 9.27711 25.4384 9.38503 25.5724 9.38503H35.3667C35.497 9.38503 35.6049 9.48922 35.6049 9.62319V13.6756C35.6049 13.8059 35.5007 13.9138 35.3667 13.9138H25.5724C25.4421 13.9138 25.3342 14.018 25.3342 14.152V18.6956C25.3342 18.8259 25.4384 18.9338 25.5724 18.9338H37.2683C37.3985 18.9338 37.5065 19.038 37.5065 19.1719V23.6188C37.5065 23.7491 37.4023 23.857 37.2683 23.857H19.7672C19.637 23.857 19.5291 23.7528 19.5291 23.6188V23.6077Z" fill="currentColor"/>
                    <path d="M39.5793 23.6077V0.628904C39.5793 0.49866 39.6835 0.390743 39.8175 0.390743H45.1501C45.2803 0.390743 45.3882 0.494939 45.3882 0.628904V18.6882C45.3882 18.8184 45.4924 18.9263 45.6264 18.9263H54.6988C54.8291 18.9263 54.937 19.0305 54.937 19.1645V23.6114C54.937 23.7417 54.8328 23.8496 54.6988 23.8496H39.8212C39.691 23.8496 39.5831 23.7454 39.5831 23.6114L39.5793 23.6077Z" fill="currentColor"/>
                    <path d="M57.2441 23.6077V0.628904C57.2441 0.49866 57.3483 0.390743 57.4823 0.390743H62.8149C62.9451 0.390743 63.053 0.494939 63.053 0.628904V23.6077C63.053 23.7379 62.9488 23.8458 62.8149 23.8458H57.4823C57.3521 23.8458 57.2441 23.7416 57.2441 23.6077Z" fill="currentColor"/>
                    <path d="M66.0227 23.6077V0.628904C66.0227 0.49866 66.1269 0.390743 66.2609 0.390743H76.5874C79.3411 0.390743 81.4734 1.11267 82.9842 2.55652C84.5583 4.02269 85.3472 5.94658 85.3472 8.32819C85.3472 10.7098 84.6216 12.4513 83.1666 13.8729C81.7115 15.2944 79.7951 16.0052 77.4098 16.0052H72.1702C72.04 16.0052 71.9321 16.1093 71.9321 16.2433V23.6077C71.9321 23.7379 71.8279 23.8458 71.6939 23.8458H66.2646C66.1343 23.8458 66.0264 23.7416 66.0264 23.6077H66.0227ZM71.9283 11.175C71.9283 11.3052 72.0325 11.4131 72.1665 11.4131H76.2264C77.2535 11.4131 78.0573 11.1303 78.6378 10.5609C79.2183 9.99159 79.5086 9.2399 79.5086 8.29842C79.5086 7.35694 79.2183 6.62013 78.6378 6.08427C78.0573 5.54841 77.2535 5.28048 76.2264 5.28048H72.1665C72.0363 5.28048 71.9283 5.38467 71.9283 5.51864V11.1787V11.175Z" fill="currentColor"/>
                    <path d="M86.9883 23.6077V0.628904C86.9883 0.49866 87.0925 0.390743 87.2264 0.390743H104.53C104.661 0.390743 104.768 0.494939 104.768 0.628904V4.94557C104.768 5.07581 104.664 5.18373 104.53 5.18373H93.0316C92.9014 5.18373 92.7934 5.28792 92.7934 5.42189V9.14687C92.7934 9.27711 92.8976 9.38503 93.0316 9.38503H102.826C102.956 9.38503 103.064 9.48922 103.064 9.62319V13.6756C103.064 13.8059 102.96 13.9138 102.826 13.9138H93.0316C92.9014 13.9138 92.7934 14.018 92.7934 14.152V18.6956C92.7934 18.8259 92.8976 18.9338 93.0316 18.9338H104.728C104.858 18.9338 104.966 19.038 104.966 19.1719V23.6188C104.966 23.7491 104.861 23.857 104.728 23.857H87.2264C87.0962 23.857 86.9883 23.7528 86.9883 23.6188V23.6077Z" fill="currentColor"/>
                    <path d="M126.355 24.2553C123.055 24.2553 120.409 23.1687 118.411 20.9992C116.327 18.7218 115.285 15.7783 115.285 12.1761C115.285 8.57391 116.435 5.39223 118.734 3.09249C120.751 1.03092 123.412 0.000125885 126.709 0.000125885C129.638 0.000125885 131.993 0.72205 133.776 2.1659C135.487 3.55393 136.559 5.43317 136.983 7.79617C137.009 7.9413 136.894 8.07526 136.749 8.07526H131.614C131.506 8.07526 131.413 8.00083 131.387 7.89664C131.148 6.99982 130.661 6.26301 129.917 5.68249C129.124 5.06476 128.119 4.7559 126.906 4.7559C125.038 4.7559 123.613 5.44061 122.623 6.80631C121.637 8.17201 121.142 9.96566 121.142 12.1798C121.142 14.394 121.674 16.1318 122.738 17.5198C123.803 18.9078 125.224 19.6037 127.003 19.6037C128.436 19.6037 129.6 19.2018 130.505 18.398C131.405 17.5942 131.922 16.6416 132.053 15.5327V15.4657H127.926C127.796 15.4657 127.688 15.3615 127.688 15.2275V11.469C127.688 11.3388 127.792 11.2309 127.926 11.2309H137.155C137.285 11.2309 137.393 11.3351 137.393 11.469V23.4962C137.393 23.6264 137.288 23.7343 137.155 23.7343H133.564C133.444 23.7343 133.344 23.645 133.329 23.5259L133.028 20.9359H132.961C131.528 23.1501 129.325 24.2553 126.352 24.2553H126.355Z" fill="currentColor"/>
                    <path d="M159.106 20.8689C157 23.1463 154.213 24.2887 150.737 24.2887C147.261 24.2887 144.482 23.15 142.387 20.8689C140.292 18.5914 139.246 15.6814 139.246 12.1425C139.246 8.60359 140.292 5.69728 142.387 3.41615C144.482 1.13874 147.265 -0.00368881 150.737 -0.00368881C154.209 -0.00368881 157 1.13502 159.106 3.41615C161.212 5.69356 162.266 8.60359 162.266 12.1425C162.266 15.6814 161.212 18.5877 159.106 20.8689ZM150.771 19.5999C152.594 19.5999 153.989 18.9115 154.953 17.5309C155.917 16.154 156.401 14.3567 156.401 12.1425C156.401 9.92835 155.917 8.12726 154.953 6.73923C153.986 5.3512 152.594 4.65533 150.771 4.65533C148.947 4.65533 147.574 5.3512 146.588 6.73923C145.602 8.12726 145.107 9.92835 145.107 12.1425C145.107 14.3567 145.602 16.1243 146.588 17.516C147.574 18.904 148.97 19.5999 150.771 19.5999Z" fill="currentColor"/>
                    <path d="M164.509 23.4961V0.69219C164.509 0.561946 164.614 0.454029 164.748 0.454029H172.079C172.186 0.454029 172.279 0.524733 172.305 0.628928L175.089 10.6466L176.425 15.9531H176.492C177.098 13.3928 177.534 11.6215 177.794 10.6466L180.611 0.628928C180.641 0.528454 180.734 0.45775 180.838 0.45775H188.236C188.366 0.45775 188.474 0.561946 188.474 0.695911V23.4998C188.474 23.63 188.37 23.738 188.236 23.738H183.436C183.306 23.738 183.198 23.6338 183.198 23.4998V12.016L183.294 7.36069H183.227C182.684 9.68275 182.327 11.1266 182.152 11.6922L178.847 23.5668C178.818 23.671 178.725 23.7417 178.62 23.7417H174.226C174.118 23.7417 174.025 23.671 173.999 23.5668L170.724 11.7257L169.649 7.36441H169.582C169.649 9.86137 169.678 11.4243 169.678 12.0532V23.5035C169.678 23.6338 169.574 23.7417 169.44 23.7417H164.736C164.606 23.7417 164.498 23.6375 164.498 23.5035L164.509 23.4961Z" fill="currentColor"/>
                    <path d="M191.191 23.4961V0.69219C191.191 0.561946 191.295 0.454029 191.429 0.454029H208.603C208.733 0.454029 208.841 0.558224 208.841 0.69219V4.97164C208.841 5.10188 208.737 5.2098 208.603 5.2098H197.193C197.063 5.2098 196.955 5.31399 196.955 5.44796V9.14317C196.955 9.27342 197.059 9.38133 197.193 9.38133H206.91C207.04 9.38133 207.148 9.48553 207.148 9.61949V13.6385C207.148 13.7687 207.043 13.8766 206.91 13.8766H197.193C197.063 13.8766 196.955 13.9808 196.955 14.1148V18.6212C196.955 18.7515 197.059 18.8594 197.193 18.8594H208.8C208.93 18.8594 209.038 18.9636 209.038 19.0975V23.5072C209.038 23.6375 208.934 23.7454 208.8 23.7454H191.433C191.303 23.7454 191.195 23.6412 191.195 23.5072L191.191 23.4961Z" fill="currentColor"/>
                    <path d="M220.514 24.2887C217.366 24.2887 214.866 23.6114 213.009 22.2532C211.215 20.9433 210.255 19.0752 210.136 16.6564C210.128 16.5224 210.24 16.4071 210.374 16.4071H215.714C215.833 16.4071 215.93 16.4964 215.948 16.6117C216.257 18.6882 217.768 19.7264 220.481 19.7264C221.523 19.7264 222.409 19.5255 223.134 19.1236C223.86 18.7217 224.225 18.1077 224.225 17.2853C224.225 16.7197 223.998 16.2508 223.54 15.8675C223.082 15.4879 222.624 15.2237 222.156 15.0711C221.69 14.9186 220.805 14.6804 219.502 14.3567C219.435 14.3343 219.394 14.3194 219.372 14.3083C219.35 14.2971 219.316 14.2859 219.275 14.2748C219.231 14.2636 219.19 14.2599 219.145 14.2599C218.148 14.0217 217.325 13.8096 216.685 13.6236C216.045 13.4412 215.32 13.1584 214.505 12.7788C213.69 12.3993 213.046 11.9825 212.566 11.5248C212.089 11.0708 211.68 10.4679 211.345 9.71624C211.01 8.96827 210.839 8.12726 210.839 7.19323C210.839 4.80418 211.691 3.01425 213.396 1.81973C215.1 0.625202 217.329 0.0298004 220.086 0.0298004C222.844 0.0298004 224.898 0.636366 226.58 1.85322C228.199 3.02541 229.092 4.71859 229.252 6.94018C229.263 7.07787 229.151 7.19323 229.014 7.19323H223.838C223.722 7.19323 223.625 7.10764 223.603 6.99228C223.465 6.19965 223.093 5.5782 222.494 5.12793C221.843 4.64044 220.976 4.39484 219.889 4.39484C218.892 4.39484 218.081 4.59579 217.463 4.99768C216.845 5.39958 216.536 5.92428 216.536 6.5755C216.536 7.31231 216.905 7.85189 217.642 8.1868C218.378 8.52172 219.77 8.91989 221.809 9.37389C223.09 9.67903 224.143 9.97673 224.969 10.2707C225.795 10.5647 226.636 10.9815 227.492 11.5248C228.348 12.0681 228.988 12.7677 229.412 13.6236C229.836 14.4795 230.048 15.5065 230.048 16.701C230.048 19.0678 229.151 20.921 227.362 22.2681C225.572 23.6151 223.287 24.285 220.507 24.285L220.514 24.2887Z" fill="currentColor"/>
                </g>
                <defs>
                    <clipPath id="clip0_logo">
                        <rect width="230.056" height="24.2887" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
        
        <div className="hidden md:flex gap-6 font-micro items-center">
            <button onClick={() => scrollToSection('cases')} className="hover:text-[#ACA4BC] transition-colors uppercase">{t.cases}</button>
            <button onClick={() => scrollToSection('feedbacks')} className="hover:text-[#ACA4BC] transition-colors uppercase">{t.clients}</button>
            <button onClick={() => scrollToSection('sobre')} className="hover:text-[#ACA4BC] transition-colors uppercase">{t.about}</button>
            <button onClick={() => scrollToSection('processo')} className="hover:text-[#ACA4BC] transition-colors uppercase">{t.process}</button>
            <button onClick={() => scrollToSection('contato')} className="hover:text-[#ACA4BC] transition-colors uppercase">{t.contact}</button>
            
            <div className="w-px h-4 bg-white/20 mx-2"></div>
            
            <button 
                onClick={toggleLanguage} 
                className="hover:text-[#ACA4BC] transition-colors uppercase font-bold"
            >
                {language === 'pt' ? 'EN' : 'PT'}
            </button>
        </div>

        <button 
            className="md:hidden relative z-50 p-2 focus:outline-none text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
        >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 bg-[#312E35]/90 backdrop-blur-xl z-[150] flex-col justify-center items-center md:hidden opacity-0 hidden"
      >
        <div className="flex flex-col gap-8 text-center font-display text-4xl text-[#F3EFF9]">
            <button onClick={() => scrollToSection('cases')} className="hover:text-[#8C6EB7] transition-colors">{t.cases}</button>
            <button onClick={() => scrollToSection('feedbacks')} className="hover:text-[#8C6EB7] transition-colors">{t.clients}</button>
            <button onClick={() => scrollToSection('sobre')} className="hover:text-[#8C6EB7] transition-colors">{t.about}</button>
            <button onClick={() => scrollToSection('processo')} className="hover:text-[#8C6EB7] transition-colors">{t.process}</button>
            <button onClick={() => scrollToSection('contato')} className="hover:text-[#8C6EB7] transition-colors">{t.contact}</button>
            <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="hover:text-[#8C6EB7] transition-colors mt-8 text-2xl font-sans">
                {language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            </button>
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9000] flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-lg max-w-sm w-full relative">
                <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                    <X size={20} />
                </button>
                <h3 className="font-display text-2xl text-[#312E35] mb-6">Acesso Admin</h3>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Senha"
                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#8C6EB7]"
                        autoFocus
                    />
                    <button type="submit" className="w-full bg-[#312E35] text-white py-3 rounded font-micro hover:bg-[#8C6EB7] transition-colors">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
      )}

      <main>
        <Hero />
        <Cases cases={cases} onViewProject={setSelectedProject} />
        <Feedbacks testimonials={testimonials} />
        <About />
        <div id="processo">
            <Process />
        </div>
        <PreContactCTA />
        <Contact />
      </main>

      {selectedProject && (
        <ProjectDetail 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
        />
      )}

      {showAdmin && (
        <Admin 
            cases={cases} 
            setCases={setCases} 
            testimonials={testimonials}
            setTestimonials={setTestimonials}
            onClose={() => setShowAdmin(false)} 
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
};

export default App;