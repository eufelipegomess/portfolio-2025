import { supabase } from './supabaseClient';
import { CaseStudy, Testimonial } from '../types';

// --- MAPPING HELPERS ---
// Converte do formato do Banco (snake_case) para o App (camelCase)
const mapCaseFromDB = (data: any): CaseStudy => ({
  ...data,
  coverUrl: data.cover_url || '', // Fallback se vier vazio
  // Garante que blocks seja array
  blocks: Array.isArray(data.blocks) ? data.blocks : []
});

// Converte do formato do App (camelCase) para o Banco (snake_case)
const mapCaseToDB = (data: CaseStudy) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { coverUrl, ...rest } = data;
  return {
    ...rest,
    cover_url: coverUrl
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
      console.error("Supabase Load Error:", error.message);
      return null;
    }
    
    // Mapeia os dados recebidos para o formato da interface CaseStudy
    return (data || []).map(mapCaseFromDB);
  } catch (error) {
    console.error("Connection Error:", error);
    return null;
  }
};

export const saveCasesToDB = async (cases: CaseStudy[]): Promise<void> => {
  try {
    // 1. Sincronização: Pegar IDs existentes para deletar os removidos
    const { data: existingData, error: fetchError } = await supabase.from('cases').select('id');
    
    if (fetchError) {
        console.error("Error fetching existing IDs:", fetchError.message);
        // Não lançamos erro aqui para tentar salvar mesmo assim
    }

    const existingIds = existingData?.map((c: any) => c.id) || [];
    const incomingIds = cases.map(c => c.id);
    
    // Identificar IDs para deletar
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    
    if (idsToDelete.length > 0) {
      await supabase.from('cases').delete().in('id', idsToDelete);
    }

    // 2. Upsert (Inserir ou Atualizar)
    if (cases.length > 0) {
      // Converte cada case para o formato do banco
      const casesFormatted = cases.map(mapCaseToDB);

      const { error } = await supabase
        .from('cases')
        .upsert(casesFormatted, { onConflict: 'id' });
        
      if (error) {
        console.error("Supabase Upsert Error:", error.message, error.details);
        throw error;
      }
    }

  } catch (error) {
    console.error("Supabase Save Critical Error:", error);
    throw error;
  }
};

// --- TESTIMONIALS (DEPOIMENTOS) ---

export const loadTestimonialsFromDB = async (): Promise<Testimonial[] | null> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*');

    if (error) {
      console.error("Supabase Load Testimonials Error:", error.message);
      return null;
    }
    return data as Testimonial[];
  } catch (error) {
    console.error("Connection Error:", error);
    return null;
  }
};

export const saveTestimonialsToDB = async (testimonials: Testimonial[]): Promise<void> => {
  try {
    const { data: existingData } = await supabase.from('testimonials').select('id');
    const existingIds = existingData?.map((t: any) => t.id) || [];
    const incomingIds = testimonials.map(t => t.id);
    
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    
    if (idsToDelete.length > 0) {
      await supabase.from('testimonials').delete().in('id', idsToDelete);
    }

    if (testimonials.length > 0) {
      const { error } = await supabase
        .from('testimonials')
        .upsert(testimonials, { onConflict: 'id' });
        
      if (error) {
          console.error("Testimonials Upsert Error:", error.message);
          throw error;
      }
    }
  } catch (error) {
    console.error("Supabase Save Testimonials Error:", error);
    throw error;
  }
};