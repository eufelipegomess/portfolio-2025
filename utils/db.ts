import { supabase } from './supabaseClient';
import { CaseStudy, Testimonial } from '../types';

// Não precisamos mais do initDB pois o cliente Supabase gerencia a conexão

// --- CASES (PROJETOS) ---

export const loadCasesFromDB = async (): Promise<CaseStudy[] | null> => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error("Supabase Load Error:", error);
      return null;
    }
    return data as CaseStudy[];
  } catch (error) {
    console.error("Connection Error:", error);
    return null;
  }
};

export const saveCasesToDB = async (cases: CaseStudy[]): Promise<void> => {
  try {
    // Para manter a sincronização perfeita com o estado local (deletar o que não existe mais),
    // primeiro vamos pegar todos os IDs existentes no banco.
    const { data: existingData } = await supabase.from('cases').select('id');
    const existingIds = existingData?.map(c => c.id) || [];
    
    const incomingIds = cases.map(c => c.id);
    
    // Identificar IDs para deletar (existem no banco mas não no estado local)
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    
    if (idsToDelete.length > 0) {
      await supabase.from('cases').delete().in('id', idsToDelete);
    }

    // Upsert (Inserir ou Atualizar) os dados atuais
    if (cases.length > 0) {
      const { error } = await supabase
        .from('cases')
        .upsert(cases, { onConflict: 'id' });
        
      if (error) throw error;
    }

  } catch (error) {
    console.error("Supabase Save Error:", error);
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
      console.error("Supabase Load Testimonials Error:", error);
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
    // Mesma lógica de sincronização: deletar removidos
    const { data: existingData } = await supabase.from('testimonials').select('id');
    const existingIds = existingData?.map(t => t.id) || [];
    const incomingIds = testimonials.map(t => t.id);
    
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
    
    if (idsToDelete.length > 0) {
      await supabase.from('testimonials').delete().in('id', idsToDelete);
    }

    if (testimonials.length > 0) {
      const { error } = await supabase
        .from('testimonials')
        .upsert(testimonials, { onConflict: 'id' });
        
      if (error) throw error;
    }
  } catch (error) {
    console.error("Supabase Save Testimonials Error:", error);
    throw error;
  }
};