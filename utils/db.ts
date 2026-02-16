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
  blocks: Array.isArray(data.blocks) ? data.blocks : [],
  order: data.sort_order // Mapeia de volta para 'order'
});

// Converte do formato do App (camelCase) para o Banco (snake_case)
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
    blocks: data.blocks, 
    sort_order: data.order // Salva em 'sort_order'
  };
};

// --- CASES (PROJETOS) ---

export const loadCasesFromDB = async (): Promise<CaseStudy[] | null> => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('sort_order', { ascending: true });

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
    // 1. Sincronização: Deletar projetos removidos
    const { data: existingData } = await supabase.from('cases').select('id');
    if (existingData) {
        const existingIds = existingData.map((c: any) => c.id);
        const incomingIds = cases.map(c => c.id);
        const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
        
        if (idsToDelete.length > 0) {
          await supabase.from('cases').delete().in('id', idsToDelete);
        }
    }

    // 2. Salvar UM POR UM para evitar erro de Payload Too Large e identificar erros específicos
    for (const project of cases) {
        const formatted = mapCaseToDB(project);
        
        // Verifica tamanho para logar aviso
        const size = JSON.stringify(formatted).length;
        if (size > 4000000) { // 4MB
            console.warn(`Aviso: O projeto "${project.title}" é muito grande (${(size/1024/1024).toFixed(2)}MB). Pode falhar.`);
        }

        const { error } = await supabase
            .from('cases')
            .upsert(formatted, { onConflict: 'id' });

        if (error) {
            console.error(`Erro ao salvar projeto "${project.title}":`, error.message);
            throw new Error(`Falha ao salvar "${project.title}": ${error.message}`);
        }
    }

  } catch (error: any) {
    console.error("Erro Crítico no Save:", error);
    throw error; // Re-throw para o App.tsx pegar e mostrar o alert
  }
};

// --- TESTIMONIALS (DEPOIMENTOS) ---

export const loadTestimonialsFromDB = async (): Promise<Testimonial[] | null> => {
  try {
    const { data, error } = await supabase.from('testimonials').select('*');
    if (error) {
        console.error("Load Testimonials Error:", error.message);
        return null;
    }
    return data as Testimonial[];
  } catch (error) {
    return null;
  }
};

export const saveTestimonialsToDB = async (testimonials: Testimonial[]): Promise<void> => {
  try {
    const { data: existingData } = await supabase.from('testimonials').select('id');
    if (existingData) {
        const existingIds = existingData.map((t: any) => t.id);
        const incomingIds = testimonials.map(t => t.id);
        const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
        
        if (idsToDelete.length > 0) {
          await supabase.from('testimonials').delete().in('id', idsToDelete);
        }
    }

    for (const t of testimonials) {
        const { error } = await supabase.from('testimonials').upsert(t, { onConflict: 'id' });
        if (error) throw new Error(`Erro ao salvar depoimento de ${t.author}: ${error.message}`);
    }
  } catch (error) {
    console.error("Save Testimonials Error:", error);
    throw error;
  }
};