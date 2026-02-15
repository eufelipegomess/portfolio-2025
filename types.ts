export type BlockType = 'text' | 'image' | 'video' | 'cover' | '2-col-text';

export type Language = 'pt' | 'en';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // Used for PT content or Media URLs
  content_en?: string; // Used for EN text content
  caption?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  // PT Fields
  category: string; 
  industry?: string;
  client: string;
  description: string; 
  challenge?: string; 
  location?: string;
  
  // EN Fields (Optional - fallback to PT if missing)
  category_en?: string;
  industry_en?: string;
  description_en?: string;
  challenge_en?: string;
  location_en?: string;

  year?: string; // Universal
  coverUrl: string; // Universal
  blocks: ContentBlock[]; 
  order: number;
}

export interface Testimonial {
  id: string;
  text: string;
  text_en?: string;
  author: string;
  company: string;
}

export interface ProcessStep {
  id: number;
  number: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
}

export interface FormData {
  name: string;
  company: string;
  email: string;
  marketTime: string;
  segment: string;
  details: string;
}