import { Language } from '../types';

export const TRANSLATIONS = {
  pt: {
    nav: {
      cases: 'CASES',
      clients: 'CLIENTES',
      about: 'SOBRE',
      process: 'PROCESSOS',
      contact: 'CONTATO',
    },
    hero: {
      badge: 'Clientes em 4 países',
      title_1: 'Marcas',
      title_2: 'com alma,',
      title_3: 'Design com',
      title_4: 'Estratégia.',
      subtitle: 'Criamos marcas com propósito e estratégia, pensadas para tornar a sua marca única, funcional e coerente.',
      cta: 'ENTRE EM CONTATO',
      explore: 'EXPLORAR'
    },
    cases: {
      title: 'CONHEÇA OS NOSSOS CASES — SELECTED WORKS',
      view_project: 'Ver Projeto',
      soon: 'Em breve'
    },
    process: {
      title_top: 'COMO FUNCIONAM OS',
      title_bottom: 'NOSSOS PROCESSOS?',
      subtitle: 'The Engine'
    },
    about: {
      label: 'Quem Sou Eu',
      text_1: 'Prazer, Felipe, tenho 23 anos, casado, cristão, Designer há mais de 8 anos. Acredito que o design não é apenas estética, mas uma ferramenta poderosa para contar histórias e construir legados.',
      text_2: 'Desde os meus 13 anos desbravo neste mundo, amadureci e durante todos esses anos pude entregar projetos que trouxeram satisfação clientes dentro e fora do Brasil, já alcançamos Portugal, Espanha, Argentina e em breve esta marca aumentará.',
      text_3: 'A excelência é o meu alvo e o design para mim vai muito além do visual, é sentimento, propósito, é ter coerência em cada detalhe, tornar ele funcional, único.',
      cards: {
        strategy: { title: 'Estratégia', desc: 'Design coerente e estratégico, alinhado aos objetivos de negócio.' },
        support: { title: 'Suporte', desc: 'Suporte e apoio pós-entrega para garantir a implementação correta.' },
        security: { title: 'Segurança', desc: 'Processos que garantem segurança e aprovação em cada etapa.' }
      }
    },
    feedbacks: {
      label: 'Social Proof',
      title: 'Clientes que puderam ter as suas marcas transformadas por nós.'
    },
    cta_section: {
      title_1: 'Estamos prontos para trazer',
      title_2: 'alma',
      title_3: 'e',
      title_4: 'estratégia',
      title_5: 'para a sua marca, vamos marcar um encontro?',
      text: 'Toque no botão abaixo e entre em contato diretamente comigo para iniciarmos a bela jornada do seu novo projeto.',
      button: 'ENTRE EM CONTATO'
    },
    contact: {
      title_1: 'VAMOS JUNTOS',
      title_2: 'CRIAR ALGO',
      title_3: 'ÚNICO.',
      form: {
        name: 'Seu Nome',
        company: 'Empresa',
        time: 'Tempo no Mercado',
        segment: 'Segmento de Atuação',
        email: 'Email',
        about: 'Sobre o Projeto',
        submit: 'ENVIAR MENSAGEM'
      },
      footer: {
        rights: '© 2026 Felipe Gomes.'
      }
    },
    project: {
      service: 'Serviço',
      industry: 'Atuação',
      year: 'Ano',
      location: 'Localização',
      description_title: 'Descrição do Projeto',
      details_title: 'Detalhes do Projeto',
      back: 'Voltar para o início'
    }
  },
  en: {
    nav: {
      cases: 'WORK',
      clients: 'CLIENTS',
      about: 'ABOUT',
      process: 'PROCESS',
      contact: 'CONTACT',
    },
    hero: {
      badge: 'Clients in 4 countries',
      title_1: 'Brands',
      title_2: 'with soul,',
      title_3: 'Design with',
      title_4: 'Strategy.',
      subtitle: 'We create brands with purpose and strategy, designed to make your brand unique, functional, and coherent.',
      cta: 'GET IN TOUCH',
      explore: 'EXPLORE'
    },
    cases: {
      title: 'DISCOVER OUR CASES — SELECTED WORKS',
      view_project: 'View Project',
      soon: 'Coming Soon'
    },
    process: {
      title_top: 'HOW DOES OUR',
      title_bottom: 'PROCESS WORK?',
      subtitle: 'The Engine'
    },
    about: {
      label: 'Who Am I',
      text_1: 'Nice to meet you, I\'m Felipe. I\'m 23, married, Christian, and have been a Designer for over 8 years. I believe design isn\'t just aesthetics—it\'s a powerful tool for storytelling and building legacies.',
      text_2: 'I\'ve been navigating this world since I was 13. Over the years, I\'ve matured professionally, delivering projects that have impacted clients both in Brazil and abroad—reaching Portugal, Spain, Argentina, and continuing to expand.',
      text_3: 'Excellence is my standard. For me, design goes far beyond the visual—it is feeling, purpose, and coherence in every detail, ensuring the result is both functional and unique.',
      cards: {
        strategy: { title: 'Strategy', desc: 'Coherent and strategic design, aligned with business objectives.' },
        support: { title: 'Support', desc: 'Post-delivery support to ensure correct implementation.' },
        security: { title: 'Security', desc: 'Processes that ensure security and approval at every stage.' }
      }
    },
    feedbacks: {
      label: 'Social Proof',
      title: 'Clients who have had their brands transformed by us.'
    },
    cta_section: {
      title_1: 'We are ready to bring',
      title_2: 'soul',
      title_3: 'and',
      title_4: 'strategy',
      title_5: 'to your brand, shall we meet?',
      text: 'Tap the button below and contact me directly to start the beautiful journey of your new project.',
      button: 'GET IN TOUCH'
    },
    contact: {
      title_1: 'LET\'S CREATE',
      title_2: 'SOMETHING',
      title_3: 'UNIQUE TOGETHER.',
      form: {
        name: 'Your Name',
        company: 'Company',
        time: 'Time in Market',
        segment: 'Business Segment',
        email: 'Email',
        about: 'About the Project',
        submit: 'SEND MESSAGE'
      },
      footer: {
        rights: '© 2026 Felipe Gomes.'
      }
    },
    project: {
      service: 'Service',
      industry: 'Industry',
      year: 'Year',
      location: 'Location',
      description_title: 'Project Description',
      details_title: 'Project Details',
      back: 'Back to home'
    }
  }
};

export const getTranslation = (lang: Language) => TRANSLATIONS[lang];