import { supabase } from './supabaseClient';
import { CaseStudy, Testimonial } from '../types';

// --- MAPPING HELPERS ---

// Converte do formato do Banco (snake_case) para o App (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapCaseFromDB = (data: any): CaseStudy => ({
  id: data.id,
  title: data.title,
  client: data.client,
  year: data.year,
  coverUrl: data.cover_url || '',
  category: data.category,
  industry: data.industry,
  location: data.location,
  description: data.description,
  challenge: data.challenge,
  category_en: data.category_en,
  industry_en: data.industry_en,
  location_en: data.location_en,
  description_en: data.description_en,
  challenge_en: data.challenge_en,
  // Garante que blocks seja array, mesmo se vier null
  blocks: Array.isArray(data.blocks) ? data.blocks : [],
  order: data.order
});

// Converte do formato do App (camelCase) para o Banco (snake_case)
// IMPORTANTE: Mapeamento manual estrito para evitar enviar campos extras que quebram o Supabase
const mapCaseToDB = (data: CaseStudy) => {
  return {
    id: data.id,
    title: data.title,
    client: data.client,
    year: data.year,
    cover_url: data.coverUrl,
    category: data.category,
    industry: data.industry,
    location: data.location,
    description: data.description,
    challenge: data.challenge,
    category_en: data.category_en,
    industry_en: data.industry_en,
    location_en: data.location_en,
    description_en: data.description_en,
    challenge_en: data.challenge_en,
    blocks: data.blocks, // Supabase trata JSONB automaticamente
    "order": data.order  // Aspas para garantir, pois order é palavra reservada SQL
  };
};

// --- CASES (PROJETOS) ---

export const loadCasesFromDB = async (): Promise<CaseStudy[] | null> => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error("Supabase Load Error (Cases):", error.message);
      return null;
    }
    
    return (data || []).map(mapCaseFromDB);
  } catch (error) {
    console.error("Connection Error (Cases):", error);
    return null;
  }
};

export const saveCasesToDB = async (cases: CaseStudy[]): Promise<void> => {
  try {
    // 1. Mapeamento Estrito dos dados
    const casesFormatted = cases.map(mapCaseToDB);

    // 2. Sincronização: Deletar projetos que não existem mais
    // Primeiro buscamos os IDs atuais no banco
    const { data: existingData, error: fetchError } = await supabase.from('cases').select('id');
    
    if (!fetchError && existingData) {
        const existingIds = existingData.map((c: any) => c.id);
        const incomingIds = cases.map(c => c.id);
        const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
        
        if (idsToDelete.length > 0) {
          await supabase.from('cases').delete().in('id', idsToDelete);
        }
    }

    // 3. Upsert (Inserir ou Atualizar)
    if (casesFormatted.length > 0) {
      const { error } = await supabase
        .from('cases')
        .upsert(casesFormatted, { onConflict: 'id' });
        
      if (error) {
        console.error("Supabase Upsert Error (Cases):", error.message, error.details);
        // Não lançar erro para não quebrar a UI, mas logar detalhadamente
      } else {
        console.log("Projects saved successfully");
      }
    }

  } catch (error) {
    console.error("Supabase Save Critical Error (Cases):", error);
  }
};

// --- TESTIMONIALS (DEPOIMENTOS) ---

export const loadTestimonialsFromDB = async (): Promise<Testimonial[] | null> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*');

    if (error) {
      console.error("Supabase Load Error (Testimonials):", error.message);
      return null;
    }
    return data as Testimonial[];
  } catch (error) {
    console.error("Connection Error (Testimonials):", error);
    return null;
  }
};

export const saveTestimonialsToDB = async (testimonials: Testimonial[]): Promise<void> => {
  try {
    // 1. Delete removed
    const { data: existingData } = await supabase.from('testimonials').select('id');
    if (existingData) {
        const existingIds = existingData.map((t: any) => t.id);
        const incomingIds = testimonials.map(t => t.id);
        const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
        
        if (idsToDelete.length > 0) {
          await supabase.from('testimonials').delete().in('id', idsToDelete);
        }
    }

    // 2. Upsert
    if (testimonials.length > 0) {
      const { error } = await supabase
        .from('testimonials')
        .upsert(testimonials, { onConflict: 'id' });
        
      if (error) {
          console.error("Supabase Upsert Error (Testimonials):", error.message);
      }
    }
  } catch (error) {
    console.error("Supabase Save Error (Testimonials):", error);
  }
};