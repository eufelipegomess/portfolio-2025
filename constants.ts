import { ProcessStep, Testimonial, CaseStudy } from './types';

export const COLORS = {
  bg: '#F3EFF9',
  textPrimary: '#312E35',
  textSecondary: '#716C7A',
  accent: '#8C6EB7',
  accentMuted: '#ACA4BC',
};

export const PROCESS_STEPS: ProcessStep[] = [
  { 
    id: 1, 
    number: '01', 
    title: 'Kickoff',
    title_en: 'Kickoff',
    description: 'O Start do nosso projeto começa com uma call inicial de absorção de informações do projeto e alinhar expectativas.',
    description_en: 'Our project starts with an initial call to absorb project insights and align expectations.'
  },
  { 
    id: 2, 
    number: '02', 
    title: 'Captação',
    title_en: 'Discovery',
    description: 'Nesta etapa nos encontraremos numa reunião de briefing para coleta de informações importantes para desenvolvimento do projeto.',
    description_en: 'In this stage, we meet for a briefing session to collect crucial data for the project development.'
  },
  { 
    id: 3, 
    number: '03', 
    title: 'Análise',
    title_en: 'Analysis',
    description: 'Aqui iremos analisar tudo que foi levantado na nossa reunião, alinhar todos os pontos e estudar o mercado de atuação, garantindo informações sólidas e estruturando um caminho coerente para inicio do projeto.',
    description_en: 'We analyze all gathered data, align objectives, and study the market to ensure solid foundations and a coherent path forward.'
  },
  { 
    id: 4, 
    number: '04', 
    title: 'Brand Heart',
    title_en: 'Brand Heart',
    description: 'Com todos os detalhes alinhados na etapa anterior, iremos definir o coração da marca, quem é, porque, para quem, atributos, levantamento dos concorrentes e oportunidades, personalidade.',
    description_en: 'We define the brand core: who it is, why it exists, for whom, its attributes, competitors, opportunities, and personality.'
  },
  { 
    id: 5, 
    number: '05', 
    title: 'Moodboard',
    title_en: 'Moodboard',
    description: 'Agora sim começaremos a falar de design, criaremos um painel de referências para entendermos qual se encaixa com o que buscamos alcançar com a direção visual da marca.',
    description_en: 'Now we talk design. We create a reference board to visualize the aesthetic direction we aim to achieve.'
  },
  { 
    id: 6, 
    number: '06', 
    title: 'Validação',
    title_en: 'Validation',
    description: 'Com os diversos testes que faremos até chegar num resultado adequado, teremos uma etapa de validação do escopo inicial para seguirmos com a marca e os demais processos.',
    description_en: 'After extensive testing, we validate the initial scope to ensure the brand identity aligns with the strategic goals.'
  },
  { 
    id: 7, 
    number: '07', 
    title: 'Apresentação',
    title_en: 'Presentation',
    description: 'Após termos a aprovação na validação, vamos seguir com a identidade, produzindo as telas, aplicações, grafismos e todo universo da marca, para apresentar o projeto final e completamente refinado.',
    description_en: 'Once approved, we develop the full identity—screens, applications, graphics, and the brand universe—to present the refined final project.'
  },
  { 
    id: 8, 
    number: '08', 
    title: 'Fechamento',
    title_en: 'Handoff',
    description: 'Então chegamos na etapa final, separaremos os arquivos e manual da marca organizados em pastas e diversos formatos, num drive do cliente, onde de forma descomplicada, terá acesso a toda sua marca de forma prática para uso e totalmente clara.',
    description_en: 'The final stage. We organize files and the brand manual into a structured client drive, providing practical and clear access to all assets.'
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  { 
    id: '1', 
    text: "Fiquei muito satisfeito com o resultado da identidade visual da Number! Ela conseguiu transmitir exatamente a essência que eu buscava para a marca e ainda mais conectada com o público. As escolhas de cores, fontes e elementos visuais ficaram incríveis e realmente destacam a proposta da empresa. Parabéns pelo trabalho, ficou excelente.", 
    text_en: "I was very satisfied with the result of Number's visual identity! It managed to convey exactly the essence I was looking for in the brand and connected even more with the audience. The choices of colors, fonts, and visual elements were amazing and really highlight the company's proposal. Congratulations on the work, it turned out excellent.",
    author: "Humberto", 
    company: "Number" 
  },
  { 
    id: '2', 
    text: "Eu amei a identidade visual. Ela reflete perfeitamente o conceito de sofisticação e exclusividade que eu queria transmitir. Os detalhes, logo, conceito, você conseguiu traduzir a essência da marca de forma muito autêntica. Muito obrigada por realizar esse nosso sonho!",
    text_en: "I loved the visual identity. It perfectly reflects the concept of sophistication and exclusivity I wanted to convey. The details, logo, concept—you managed to translate the brand's essence in a very authentic way. Thank you so much for making this dream come true!",
    author: "Nathalie",
    company: "Luxury Objective"
  },
  { 
    id: '3', 
    text: "Muito obrigado de coração, fizeram isto com o coração de vocês, da pra sentir. Estou feliz demais com toda a marca construída!",
    text_en: "Thank you from the bottom of my heart, you did this with your heart, I can feel it. I am overjoyed with the entire brand that was built!",
    author: "Alex Araldi",
    company: "Grano & Afecto"
  }
];

export const INITIAL_CASES: CaseStudy[] = [
  {
    id: 'c1',
    title: 'Lumina Architecture',
    category: 'Identidade Visual',
    category_en: 'Visual Identity',
    industry: 'Arquitetura',
    industry_en: 'Architecture',
    client: 'Lumina Arch',
    description: 'Desenvolvimento de uma identidade visual minimalista e sofisticada para um escritório de arquitetura de alto padrão.',
    description_en: 'Development of a minimalist and sophisticated visual identity for a high-end architecture firm.',
    challenge: 'Transmitir solidez e elegância sem cair no lugar comum do setor.',
    challenge_en: 'Convey solidity and elegance without falling into sector clichés.',
    location: 'São Paulo, Brasil',
    location_en: 'São Paulo, Brazil',
    year: '2023',
    coverUrl: 'https://picsum.photos/1200/900?grayscale&random=1',
    blocks: [
        {
            id: 'b1',
            type: 'text',
            content: 'A marca foi construída baseada nos pilares de luz e sombra, fundamentais na arquitetura.',
            content_en: 'The brand was built on the pillars of light and shadow, fundamental in architecture.'
        },
        {
             id: 'b2',
             type: 'image',
             content: 'https://picsum.photos/1200/800?grayscale&random=2'
        }
    ],
    order: 1
  },
  {
    id: 'c2',
    title: 'Venture Capital',
    category: 'Web Design',
    category_en: 'Web Design',
    industry: 'Finanças',
    industry_en: 'Finance',
    client: 'Venture Corp',
    description: 'Interface digital moderna para uma empresa de capital de risco focada em startups de tecnologia.',
    description_en: 'Modern digital interface for a venture capital firm focused on tech startups.',
    challenge: 'Simplificar dados complexos em uma interface amigável e atraente.',
    challenge_en: 'Simplify complex data into a friendly and attractive interface.',
    location: 'Lisboa, Portugal',
    location_en: 'Lisbon, Portugal',
    year: '2024',
    coverUrl: 'https://picsum.photos/1200/900?grayscale&random=3',
    blocks: [],
    order: 2
  }
];