import React, { useState, useEffect } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { CaseStudy, ContentBlock, Testimonial } from '../types';
import { X, Image as ImageIcon, Type, Video, Plus, Save, Trash2, GripVertical, Upload, ArrowLeft, Edit2, Check, AlertCircle, Columns, Globe, Sparkles, Loader2, Quote, MessageSquare } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { GoogleGenAI } from "@google/genai";

interface AdminProps {
  cases: CaseStudy[];
  setCases: React.Dispatch<React.SetStateAction<CaseStudy[]>>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  onClose: () => void;
}

const Admin: React.FC<AdminProps> = ({ cases, setCases, testimonials, setTestimonials, onClose }) => {
  const [tab, setTab] = useState<'projects' | 'feedbacks'>('projects');
  
  // PROJECTS STATE
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [editLang, setEditLang] = useState<'pt' | 'en'>('pt');
  const [isTranslating, setIsTranslating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // PROJECT EDITOR FIELDS
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [category, setCategory] = useState(''); // PT
  const [categoryEn, setCategoryEn] = useState(''); // EN
  const [industry, setIndustry] = useState(''); // PT
  const [industryEn, setIndustryEn] = useState(''); // EN
  const [location, setLocation] = useState(''); // PT
  const [locationEn, setLocationEn] = useState(''); // EN
  const [description, setDescription] = useState(''); // PT
  const [descriptionEn, setDescriptionEn] = useState(''); // EN
  const [challenge, setChallenge] = useState(''); // PT
  const [challengeEn, setChallengeEn] = useState(''); // EN
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  // FEEDBACKS STATE
  const [editingFeedback, setEditingFeedback] = useState<Testimonial | null>(null);
  const [fbView, setFbView] = useState<'list' | 'editor'>('list');
  const [fbAuthor, setFbAuthor] = useState('');
  const [fbCompany, setFbCompany] = useState('');
  const [fbText, setFbText] = useState('');
  const [fbTextEn, setFbTextEn] = useState('');
  const [fbDeleteConfirmId, setFbDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // --- PROJECT LOGIC ---

  const startEdit = (project?: CaseStudy) => {
    setEditLang('pt');
    if (project) {
        setEditingCase(project);
        setTitle(project.title || '');
        setClient(project.client || '');
        setYear(project.year || '');
        setCoverUrl(project.coverUrl || '');
        setCategory(project.category || '');
        setIndustry(project.industry || '');
        setLocation(project.location || '');
        setDescription(project.description || '');
        setChallenge(project.challenge || '');
        setCategoryEn(project.category_en || '');
        setIndustryEn(project.industry_en || '');
        setLocationEn(project.location_en || '');
        setDescriptionEn(project.description_en || '');
        setChallengeEn(project.challenge_en || '');
        setBlocks(project.blocks ? JSON.parse(JSON.stringify(project.blocks)) : []);
    } else {
        setEditingCase(null);
        setTitle('');
        setClient('');
        setYear('');
        setCoverUrl('');
        setCategory('');
        setCategoryEn('');
        setIndustry('');
        setIndustryEn('');
        setLocation('');
        setLocationEn('');
        setDescription('');
        setDescriptionEn('');
        setChallenge('');
        setChallengeEn('');
        setBlocks([]);
    }
    setView('editor');
  };

  const addBlock = (type: 'text' | 'image' | 'video' | '2-col-text') => {
      const newBlock: ContentBlock = {
          id: `b${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          content: type === '2-col-text' ? JSON.stringify({ left: '', right: '' }) : '',
          content_en: type === '2-col-text' ? JSON.stringify({ left: '', right: '' }) : ''
      };
      setBlocks(prev => [...prev, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
      setBlocks(prev => prev.map(b => {
          if (b.id !== id) return b;
          if (b.type === 'image' || b.type === 'video') {
              return { ...b, content };
          }
          if (editLang === 'pt') {
              return { ...b, content };
          } else {
              return { ...b, content_en: content };
          }
      }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                updateBlockContent(id, reader.result);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setCoverUrl(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const removeBlock = (id: string) => {
      setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleAutoTranslate = async () => {
    // Safe Env Access for API Key
    let apiKey = '';
    try {
        if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
            apiKey = (import.meta as any).env.VITE_GOOGLE_API_KEY || (import.meta as any).env.API_KEY;
        }
    } catch(e) {}

    if (!apiKey) {
        try {
            if (typeof process !== 'undefined' && process.env) {
                apiKey = process.env.API_KEY || process.env.REACT_APP_GOOGLE_API_KEY;
            }
        } catch(e) {}
    }

    if (!apiKey) {
        alert("API Key não configurada. Configure VITE_GOOGLE_API_KEY no .env");
        return;
    }

    if (!category && !description && !industry) {
        alert("Preencha os campos em Português antes de traduzir.");
        return;
    }

    setIsTranslating(true);

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const textBlocks = blocks.filter(b => b.type === 'text' || b.type === '2-col-text').map(b => ({
            id: b.id,
            type: b.type,
            content: b.content 
        }));

        const payload = {
            category,
            industry,
            location,
            description,
            challenge,
            textBlocks
        };

        const prompt = `
            You are a professional translator for a high-end design portfolio. 
            Translate the following JSON object from Portuguese (PT-BR) to English (EN).
            
            Rules:
            1. Keep the tone sophisticated, minimal, and strategic (Awwwards style).
            2. Maintain all HTML tags (like <b>, <br>, <h2>) exactly as they are.
            3. Do not translate 'id' or 'type'.
            4. For '2-col-text' blocks, the content is a JSON string. Parse it, translate 'left' and 'right' properties, and return as a JSON string.
            5. Return ONLY valid JSON.

            Input JSON:
            ${JSON.stringify(payload)}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const translatedData = JSON.parse(response.text);

        if (translatedData.category) setCategoryEn(translatedData.category);
        if (translatedData.industry) setIndustryEn(translatedData.industry);
        if (translatedData.location) setLocationEn(translatedData.location);
        if (translatedData.description) setDescriptionEn(translatedData.description);
        if (translatedData.challenge) setChallengeEn(translatedData.challenge);

        if (translatedData.textBlocks && Array.isArray(translatedData.textBlocks)) {
            setBlocks(prevBlocks => prevBlocks.map(block => {
                const translatedBlock = translatedData.textBlocks.find((tb: any) => tb.id === block.id);
                if (translatedBlock) {
                    return {
                        ...block,
                        content_en: translatedBlock.content
                    };
                }
                return block;
            }));
        }
        
        setEditLang('en');
        alert("Tradução concluída com sucesso! Verifique os campos em Inglês.");
    } catch (error) {
        console.error("Translation error:", error);
        alert("Erro ao traduzir. Tente novamente.");
    } finally {
        setIsTranslating(false);
    }
  };

  const saveProject = () => {
      if (!title) {
          alert("O título é obrigatório.");
          return;
      }
      const newCase: CaseStudy = {
          id: editingCase ? editingCase.id : `c${Date.now()}`,
          title,
          client: client || 'Cliente Confidencial',
          year,
          coverUrl: coverUrl || 'https://picsum.photos/800/600',
          blocks,
          order: editingCase ? editingCase.order : cases.length + 1,
          category, industry, location, description, challenge,
          category_en: categoryEn, industry_en: industryEn, location_en: locationEn, description_en: descriptionEn, challenge_en: challengeEn
      };

      if (editingCase) {
          setCases(prev => prev.map(c => c.id === editingCase.id ? newCase : c));
      } else {
          setCases(prev => [...prev, newCase]);
      }
      setView('list');
  };

  const handleDeleteClick = (id: string) => {
      if (deleteConfirmId === id) {
          setCases(prev => prev.filter(c => c.id !== id));
          setDeleteConfirmId(null);
      } else {
          setDeleteConfirmId(id);
          setTimeout(() => setDeleteConfirmId(null), 3000);
      }
  };

  // --- FEEDBACKS LOGIC ---

  const startEditFeedback = (fb?: Testimonial) => {
      if (fb) {
          setEditingFeedback(fb);
          setFbAuthor(fb.author);
          setFbCompany(fb.company);
          setFbText(fb.text);
          setFbTextEn(fb.text_en || '');
      } else {
          setEditingFeedback(null);
          setFbAuthor('');
          setFbCompany('');
          setFbText('');
          setFbTextEn('');
      }
      setFbView('editor');
  };

  const handleFeedbackTranslate = async () => {
    // Safe Env Access for API Key
    let apiKey = '';
    try {
        if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
            apiKey = (import.meta as any).env.VITE_GOOGLE_API_KEY || (import.meta as any).env.API_KEY;
        }
    } catch(e) {}

    if (!apiKey) {
        try {
            if (typeof process !== 'undefined' && process.env) {
                apiKey = process.env.API_KEY || process.env.REACT_APP_GOOGLE_API_KEY;
            }
        } catch(e) {}
    }

    if (!apiKey) {
        alert("API Key não configurada. Configure VITE_GOOGLE_API_KEY no .env");
        return;
    }
    
    if (!fbText) return;
    setIsTranslating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const prompt = `Translate this testimonial from Portuguese to English. Keep the tone natural and professional: "${fbText}"`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        setFbTextEn(response.text.trim());
    } catch (e) {
        console.error("Translation failed", e);
        alert("Erro na tradução.");
    } finally {
        setIsTranslating(false);
    }
  };

  const saveFeedback = () => {
      if (!fbAuthor || !fbText) {
          alert("Autor e Depoimento (PT) são obrigatórios.");
          return;
      }
      const newFb: Testimonial = {
          id: editingFeedback ? editingFeedback.id : `fb${Date.now()}`,
          author: fbAuthor,
          company: fbCompany,
          text: fbText,
          text_en: fbTextEn
      };

      if (editingFeedback) {
          setTestimonials(prev => prev.map(f => f.id === editingFeedback.id ? newFb : f));
      } else {
          setTestimonials(prev => [...prev, newFb]);
      }
      setFbView('list');
  };

  const handleDeleteFeedback = (id: string) => {
      if (fbDeleteConfirmId === id) {
          setTestimonials(prev => prev.filter(f => f.id !== id));
          setFbDeleteConfirmId(null);
      } else {
          setFbDeleteConfirmId(id);
          setTimeout(() => setFbDeleteConfirmId(null), 3000);
      }
  };

  // --- RENDER ---

  const isProjectEditor = tab === 'projects' && view === 'editor';
  const isFeedbackEditor = tab === 'feedbacks' && fbView === 'editor';
  const isListMode = (tab === 'projects' && view === 'list') || (tab === 'feedbacks' && fbView === 'list');

  return (
    <div 
        data-lenis-prevent 
        className="fixed inset-0 bg-white z-[10000] overflow-y-auto w-full h-full"
    >
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30 shadow-sm">
        <div className="flex items-center gap-4">
            {(isProjectEditor || isFeedbackEditor) && (
                <button onClick={() => isProjectEditor ? setView('list') : setFbView('list')} className="p-2 hover:bg-gray-100 rounded-full text-[#312E35]">
                    <ArrowLeft size={24} />
                </button>
            )}
            <h2 className="font-display text-2xl text-[#312E35]">
                Admin
            </h2>

            {/* Tab Switcher (Only in List Mode) */}
            {isListMode && (
                <div className="flex bg-gray-100 p-1 rounded-lg ml-4">
                    <button 
                        onClick={() => setTab('projects')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${tab === 'projects' ? 'bg-white shadow text-[#312E35]' : 'text-gray-400'}`}
                    >
                        <ImageIcon size={14}/> PROJETOS
                    </button>
                    <button 
                        onClick={() => setTab('feedbacks')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${tab === 'feedbacks' ? 'bg-white shadow text-[#312E35]' : 'text-gray-400'}`}
                    >
                        <MessageSquare size={14}/> DEPOIMENTOS
                    </button>
                </div>
            )}
        </div>
        
        {/* Project Editor Actions */}
        {isProjectEditor && (
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleAutoTranslate}
                    disabled={isTranslating}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#8C6EB7] to-[#716C7A] text-white rounded-md text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {isTranslating ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} />}
                    {isTranslating ? 'TRADUZINDO...' : 'TRADUZIR PARA INGLÊS'}
                </button>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setEditLang('pt')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${editLang === 'pt' ? 'bg-white shadow text-[#312E35]' : 'text-gray-400'}`}>PT</button>
                    <button onClick={() => setEditLang('en')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${editLang === 'en' ? 'bg-white shadow text-[#312E35]' : 'text-gray-400'}`}>EN</button>
                </div>
            </div>
        )}

        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-[#312E35]"><X size={24} /></button>
      </div>

      <div className="pt-24 pb-32 max-w-5xl mx-auto px-6">
        
        {/* --- PROJECTS LIST --- */}
        {tab === 'projects' && view === 'list' && (
            <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                    <p className="text-gray-500 font-light">{cases.length} projetos cadastrados.</p>
                    <button onClick={() => startEdit()} className="bg-[#8C6EB7] text-white px-6 py-3 rounded-[4px] font-micro flex items-center gap-2 hover:bg-[#312E35] transition-colors shadow-lg shadow-[#8C6EB7]/20">
                        <Plus size={18} /> CRIAR NOVO PROJETO
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map(project => (
                        <div key={project.id} className="border border-gray-200 rounded-[4px] overflow-hidden bg-white flex flex-col hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gray-100 border-b border-gray-100">
                                <img src={project.coverUrl} className="w-full h-full object-cover" alt={project.title} />
                            </div>
                            <div className="p-5 flex flex-col h-full justify-between">
                                <div className="mb-4">
                                    <h3 className="font-display text-xl text-[#312E35] mb-1">{project.title}</h3>
                                    <p className="text-sm text-gray-500">{project.client}</p>
                                </div>
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <button onClick={() => startEdit(project)} className="flex-1 bg-[#F3EFF9] text-[#312E35] px-4 py-2 rounded-[4px] text-xs font-bold font-micro hover:bg-[#312E35] hover:text-white transition-colors flex items-center justify-center gap-2">
                                        <Edit2 size={14} /> EDITAR
                                    </button>
                                    <button onClick={() => handleDeleteClick(project.id)} className={`px-3 py-2 rounded-[4px] transition-all duration-300 border flex items-center gap-2 font-bold font-micro text-xs ${deleteConfirmId === project.id ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}>
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- FEEDBACKS LIST --- */}
        {tab === 'feedbacks' && fbView === 'list' && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                    <p className="text-gray-500 font-light">{testimonials.length} depoimentos cadastrados.</p>
                    <button onClick={() => startEditFeedback()} className="bg-[#8C6EB7] text-white px-6 py-3 rounded-[4px] font-micro flex items-center gap-2 hover:bg-[#312E35] transition-colors shadow-lg shadow-[#8C6EB7]/20">
                        <Plus size={18} /> NOVO DEPOIMENTO
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map(fb => (
                        <div key={fb.id} className="border border-gray-200 rounded-[4px] bg-white p-6 hover:shadow-lg transition-shadow">
                            <Quote className="text-[#8C6EB7] mb-4 opacity-50" size={24}/>
                            <p className="text-[#312E35] italic mb-4 line-clamp-3">"{fb.text}"</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="font-bold text-sm text-[#312E35]">{fb.author}</p>
                                    <p className="text-xs text-gray-500">{fb.company}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEditFeedback(fb)} className="p-2 bg-gray-100 text-[#312E35] rounded-[4px] hover:bg-[#312E35] hover:text-white transition-colors">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteFeedback(fb.id)} className={`p-2 rounded-[4px] transition-colors ${fbDeleteConfirmId === fb.id ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* --- PROJECT EDITOR --- */}
        {tab === 'projects' && view === 'editor' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="bg-white border border-gray-200 p-8 rounded-[4px] space-y-6 shadow-sm">
                    {/* ... (Keep existing project editor fields exactly as they were) ... */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#8C6EB7]"></div>
                            <h3 className="font-micro text-[#716C7A]">Informações Principais</h3>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-[#F3EFF9] rounded text-[#8C6EB7] uppercase">
                            Editando: {editLang === 'pt' ? 'Português' : 'Inglês'}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Título do Projeto (Universal)</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Aura Skin" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Cliente (Universal)</label>
                            <input value={client} onChange={e => setClient(e.target.value)} placeholder="Ex: Aura Cosmetics" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Serviços (Categoria) - {editLang.toUpperCase()}</label>
                            <input value={editLang === 'pt' ? category : categoryEn} onChange={e => editLang === 'pt' ? setCategory(e.target.value) : setCategoryEn(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Indústria - {editLang.toUpperCase()}</label>
                            <input value={editLang === 'pt' ? industry : industryEn} onChange={e => editLang === 'pt' ? setIndustry(e.target.value) : setIndustryEn(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Ano (Universal)</label>
                            <input value={year} onChange={e => setYear(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Localização - {editLang.toUpperCase()}</label>
                            <input value={editLang === 'pt' ? location : locationEn} onChange={e => editLang === 'pt' ? setLocation(e.target.value) : setLocationEn(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Descrição ({editLang.toUpperCase()})</label>
                        <textarea value={editLang === 'pt' ? description : descriptionEn} onChange={e => editLang === 'pt' ? setDescription(e.target.value) : setDescriptionEn(e.target.value)} rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors resize-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Detalhes ({editLang.toUpperCase()})</label>
                        <textarea value={editLang === 'pt' ? challenge : challengeEn} onChange={e => editLang === 'pt' ? setChallenge(e.target.value) : setChallengeEn(e.target.value)} rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors resize-none" />
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase">Capa do Projeto</label>
                         <div className="flex items-start gap-6 border-t border-gray-100 pt-4">
                            <div className="w-32 h-24 bg-gray-100 rounded-[4px] overflow-hidden flex-shrink-0 border border-gray-200">
                                {coverUrl ? <img src={coverUrl} className="w-full h-full object-cover" alt="Cover preview" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sem Imagem</div>}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer inline-flex items-center gap-2 bg-[#312E35] text-white px-4 py-2 rounded-[4px] font-micro hover:bg-[#8C6EB7] transition-colors">
                                    <Upload size={16} /> Upload
                                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                                </label>
                            </div>
                         </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <h3 className="font-micro text-[#716C7A]">Conteúdo Detalhado</h3>
                        <span className="text-xs text-gray-400">{blocks.length} blocos</span>
                    </div>
                    <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {blocks.map((block) => (
                           <ReorderItem 
                                key={block.id} 
                                block={block} 
                                onRemove={removeBlock} 
                                onUpdate={updateBlockContent}
                                onFileUpload={handleFileUpload}
                                editLang={editLang}
                            />
                        ))}
                    </Reorder.Group>
                    <div className="flex flex-wrap justify-center gap-4 py-8">
                        <button onClick={() => addBlock('image')} className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-[#8C6EB7] hover:text-[#8C6EB7] shadow-sm transition-all"><ImageIcon size={18}/> Imagem</button>
                        <button onClick={() => addBlock('text')} className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-[#8C6EB7] hover:text-[#8C6EB7] shadow-sm transition-all"><Type size={18}/> Texto</button>
                        <button onClick={() => addBlock('2-col-text')} className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-[#8C6EB7] hover:text-[#8C6EB7] shadow-sm transition-all"><Columns size={18}/> Colunas</button>
                        <button onClick={() => addBlock('video')} className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-[#8C6EB7] hover:text-[#8C6EB7] shadow-sm transition-all"><Video size={18}/> Vídeo</button>
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:px-8 flex justify-end items-center z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    <button onClick={saveProject} className="bg-[#312E35] text-white px-8 py-4 rounded-[4px] font-micro tracking-widest flex items-center gap-3 hover:bg-[#8C6EB7] transition-all transform active:scale-95 shadow-lg">
                        <Save size={18}/> {editingCase ? 'SALVAR ALTERAÇÕES' : 'CRIAR PROJETO'}
                    </button>
                </div>
            </div>
        )}

        {/* --- FEEDBACK EDITOR --- */}
        {tab === 'feedbacks' && fbView === 'editor' && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white border border-gray-200 p-8 rounded-[4px] space-y-6 shadow-sm">
                    <h3 className="font-display text-xl text-[#312E35] mb-4">Dados do Cliente</h3>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome do Cliente</label>
                        <input value={fbAuthor} onChange={e => setFbAuthor(e.target.value)} placeholder="Ex: João Silva" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Empresa / Projeto</label>
                        <input value={fbCompany} onChange={e => setFbCompany(e.target.value)} placeholder="Ex: Tech Solutions" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors" />
                    </div>
                    
                    <div className="h-px bg-gray-100 my-4"></div>
                    
                    <h3 className="font-display text-xl text-[#312E35] mb-4">Depoimento</h3>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Mensagem em Português</label>
                        <textarea value={fbText} onChange={e => setFbText(e.target.value)} rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors resize-none" placeholder="O que o cliente disse..."/>
                    </div>

                    <div className="flex justify-center my-2">
                         <button 
                            onClick={handleFeedbackTranslate}
                            disabled={!fbText || isTranslating}
                            className="text-xs font-bold text-[#8C6EB7] flex items-center gap-2 hover:bg-[#F3EFF9] px-3 py-2 rounded transition-colors disabled:opacity-50"
                         >
                            {isTranslating ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                            TRADUZIR PARA INGLÊS COM IA
                         </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Mensagem em Inglês (Opcional)</label>
                        <textarea value={fbTextEn} onChange={e => setFbTextEn(e.target.value)} rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#8C6EB7] transition-colors resize-none" />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                     <button onClick={() => setFbView('list')} className="px-6 py-3 rounded-[4px] font-micro text-gray-500 hover:text-[#312E35] transition-colors">CANCELAR</button>
                     <button onClick={saveFeedback} className="bg-[#312E35] text-white px-8 py-3 rounded-[4px] font-micro tracking-widest flex items-center gap-3 hover:bg-[#8C6EB7] transition-all shadow-lg">
                        <Save size={18}/> SALVAR
                    </button>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

// Reorder Item Component (Same as before)
interface ReorderItemProps {
    block: ContentBlock; 
    onRemove: (id: string) => void;
    onUpdate: (id: string, content: string) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    editLang: 'pt' | 'en';
}

const ReorderItem: React.FC<ReorderItemProps> = ({ block, onRemove, onUpdate, onFileUpload, editLang }) => {
    const dragControls = useDragControls();
    const currentContent = (block.type === 'text' || block.type === '2-col-text') 
        ? (editLang === 'pt' ? block.content : (block.content_en || ''))
        : block.content;
    const getCols = (content: string) => {
        try { return content ? JSON.parse(content) : { left: '', right: '' }; } catch(e) { return { left: '', right: '' }; }
    };
    const handleColUpdate = (side: 'left' | 'right', val: string) => {
        const current = getCols(currentContent);
        const newData = { ...current, [side]: val };
        onUpdate(block.id, JSON.stringify(newData));
    };

    return (
        <Reorder.Item value={block} dragListener={false} dragControls={dragControls} className="relative border border-gray-200 rounded-[4px] p-6 bg-white hover:shadow-md transition-shadow group">
            <div className="absolute right-4 top-4 flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity z-10">
                <div onPointerDown={(e) => dragControls.start(e)} className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing text-gray-400"><GripVertical size={16} /></div>
                <button onClick={() => onRemove(block.id)} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"><X size={16}/></button>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="mt-2 text-gray-300 p-3 bg-gray-50 rounded-full flex-shrink-0">
                    {block.type === 'text' && <Type size={20}/>}
                    {block.type === '2-col-text' && <Columns size={20}/>}
                    {block.type === 'image' && <ImageIcon size={20}/>}
                    {block.type === 'video' && <Video size={20}/>}
                </div>
                <div className="w-full pr-0 md:pr-12">
                    <label className="block text-xs font-bold uppercase mb-3 text-gray-500 tracking-wider">
                        {block.type === 'text' && `Texto (${editLang})`}
                        {block.type === '2-col-text' && `Colunas (${editLang})`}
                        {block.type === 'image' && 'Imagem'}
                        {block.type === 'video' && 'Vídeo'}
                    </label>
                    {block.type === 'text' && <RichTextEditor key={`${block.id}-${editLang}`} initialContent={currentContent || ''} onChange={(content) => onUpdate(block.id, content)} />}
                    {block.type === '2-col-text' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><span className="text-xs text-gray-400 mb-2 block font-micro">Esquerda</span><RichTextEditor key={`${block.id}-left-${editLang}`} initialContent={getCols(currentContent).left} onChange={(val) => handleColUpdate('left', val)} /></div>
                             <div><span className="text-xs text-gray-400 mb-2 block font-micro">Direita</span><RichTextEditor key={`${block.id}-right-${editLang}`} initialContent={getCols(currentContent).right} onChange={(val) => handleColUpdate('right', val)} /></div>
                        </div>
                    )}
                    {(block.type === 'image' || block.type === 'video') && (
                        <div className="space-y-4">
                            {block.content ? (
                                <div className="relative w-full max-w-md bg-gray-100 rounded-[4px] overflow-hidden border border-gray-200">
                                    {block.type === 'image' ? <img src={block.content} className="w-full h-auto" alt="Preview" /> : <video src={block.content} className="w-full h-auto" controls />}
                                    <button onClick={() => onUpdate(block.id, '')} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"><X size={12}/></button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-[4px] cursor-pointer hover:bg-gray-50 hover:border-[#8C6EB7] transition-all group-upload">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6"><Upload className="w-8 h-8 mb-4 text-gray-400 group-hover:text-[#8C6EB7] transition-colors" /><p className="mb-2 text-sm text-gray-500">Clique para enviar</p></div>
                                    <input type="file" className="hidden" accept={block.type === 'image' ? "image/*" : "video/*"} onChange={(e) => onFileUpload(e, block.id)} />
                                </label>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Reorder.Item>
    );
};

export default Admin;