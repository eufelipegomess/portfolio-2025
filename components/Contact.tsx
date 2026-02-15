import React, { useState } from 'react';
import MagneticButton from './MagneticButton';
import { Instagram, Linkedin, Loader2, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const t = getTranslation(language).contact;

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    time: '',
    segment: '',
    email: '',
    about: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const formPayload = new FormData();
    // Campos Visíveis
    formPayload.append('Nome', formData.name);
    formPayload.append('Empresa', formData.company);
    formPayload.append('Tempo de Mercado', formData.time);
    formPayload.append('Segmento', formData.segment);
    formPayload.append('Email', formData.email);
    formPayload.append('Detalhes do Projeto', formData.about);
    
    // Configurações Ocultas (FormSubmit)
    formPayload.append('_replyto', formData.email);
    formPayload.append('_subject', `Novo Lead do Site: ${formData.name} (${formData.company})`);
    formPayload.append('_template', 'table');
    formPayload.append('_captcha', 'false');
    formPayload.append('_autoresponse', 'Recebemos seu contato. Em breve retornaremos. Atenciosamente, Felipe Gomes.');

    try {
        const response = await fetch("https://formsubmit.co/contato@felipegomesdsg.com", {
            method: "POST",
            body: formPayload,
            headers: { 
                'Accept': 'application/json' 
            }
        });

        if (response.ok) {
            handleSuccess();
        } else {
            throw new Error("Erro na comunicação com servidor de email");
        }
    } catch (error) {
        console.error("Erro crítico de envio:", error);
        setStatus('error');
    }
  };

  const handleSuccess = () => {
    setStatus('success');
    setFormData({ name: '', company: '', time: '', segment: '', email: '', about: '' });
    setTimeout(() => setStatus('idle'), 6000);
  };

  return (
    <section id="contato" className="py-32 px-6 md:px-20 min-h-screen bg-[#F3EFF9] flex flex-col items-center justify-center relative">
      <div className="max-w-4xl w-full text-center">
        <h2 className="font-display text-5xl md:text-8xl text-[#312E35] mb-12">
          {t.title_1} <br/>
          {t.title_2} <span className="text-[#8C6EB7]">{t.title_3}</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8 text-left">
          {/* Honeypot para evitar bots simples (invisível) */}
          <input type="text" name="_honey" style={{display: 'none'}} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative">
               <label className="font-micro text-[#716C7A] block mb-2">{t.form.name} *</label>
               <input 
                 required
                 type="text" 
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 className="w-full bg-transparent border-b border-[#ACA4BC] py-2 text-xl text-[#312E35] focus:outline-none focus:border-[#8C6EB7] transition-colors" 
               />
            </div>
            <div className="group relative">
               <label className="font-micro text-[#716C7A] block mb-2">{t.form.company} *</label>
               <input 
                 required
                 type="text" 
                 name="company"
                 value={formData.company}
                 onChange={handleChange}
                 className="w-full bg-transparent border-b border-[#ACA4BC] py-2 text-xl text-[#312E35] focus:outline-none focus:border-[#8C6EB7] transition-colors" 
               />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative">
               <label className="font-micro text-[#716C7A] block mb-2">{t.form.time}</label>
               <input 
                 type="text" 
                 name="time"
                 value={formData.time}
                 onChange={handleChange}
                 className="w-full bg-transparent border-b border-[#ACA4BC] py-2 text-xl text-[#312E35] focus:outline-none focus:border-[#8C6EB7] transition-colors" 
               />
            </div>
            <div className="group relative">
               <label className="font-micro text-[#716C7A] block mb-2">{t.form.segment}</label>
               <input 
                 type="text" 
                 name="segment"
                 value={formData.segment}
                 onChange={handleChange}
                 className="w-full bg-transparent border-b border-[#ACA4BC] py-2 text-xl text-[#312E35] focus:outline-none focus:border-[#8C6EB7] transition-colors" 
               />
            </div>
          </div>
          
          <div className="group relative">
             <label className="font-micro text-[#716C7A] block mb-2">{t.form.email} *</label>
             <input 
               required
               type="email" 
               name="email"
               value={formData.email}
               onChange={handleChange}
               className="w-full bg-transparent border-b border-[#ACA4BC] py-2 text-xl text-[#312E35] focus:outline-none focus:border-[#8C6EB7] transition-colors" 
             />
          </div>

          <div className="group relative">
             <label className="font-micro text-[#716C7A] block mb-2">{t.form.about} *</label>
             <textarea 
               required
               rows={4} 
               name="about"
               value={formData.about}
               onChange={handleChange}
               className="w-full bg-transparent border-b border-[#ACA4BC] py-2 text-xl text-[#312E35] focus:outline-none focus:border-[#8C6EB7] transition-colors resize-none"
             ></textarea>
          </div>

          <div className="pt-10 flex flex-col items-center justify-center gap-4">
            {status === 'success' ? (
                <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-500 bg-white/50 p-6 rounded-lg border border-green-200">
                    <CheckCircle className="text-green-500 w-12 h-12" />
                    <p className="font-display text-xl text-[#312E35]">Mensagem Enviada!</p>
                    <p className="text-[#716C7A] font-light text-center">Obrigado pelo contato. <br/> Retornaremos em breve.</p>
                </div>
            ) : (
                <MagneticButton type="submit" className={status === 'sending' ? 'opacity-80 pointer-events-none' : ''}>
                   {status === 'sending' ? (
                       <span className="flex items-center gap-2">
                           <Loader2 className="animate-spin w-4 h-4"/> ENVIANDO...
                       </span>
                   ) : (
                       t.form.submit
                   )}
                </MagneticButton>
            )}
            
            {status === 'error' && (
                <div className="flex flex-col items-center gap-2 animate-in fade-in">
                    <p className="text-red-500 font-micro flex items-center gap-2">
                        <AlertCircle size={14}/> Erro técnico no envio.
                    </p>
                    <a 
                        href="https://wa.me/5571999278413?text=Olá,%20tentei%20contato%20pelo%20site%20mas%20tive%20problema,%20pode%20me%20ajudar?" 
                        target="_blank"
                        className="text-[#8C6EB7] font-bold text-sm hover:underline flex items-center gap-2"
                    >
                        <MessageCircle size={14}/>
                        Chamar no WhatsApp
                    </a>
                </div>
            )}
          </div>
        </form>
      </div>

      <footer className="w-full px-0 md:px-10 mt-32 border-t border-[#ACA4BC]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Simple Text - No Admin Trigger */}
        <span className="text-[#716C7A] text-sm text-left cursor-default">
           {t.footer.rights}
        </span>
        
        <div className="flex gap-4">
            <a 
              href="https://instagram.com/eufelipegomess" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#312E35] hover:text-[#8C6EB7] transition-colors"
            >
              <Instagram size={20}/>
            </a>
            <a 
              href="https://www.linkedin.com/in/felipe-gomes-2b41271a5/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#312E35] hover:text-[#8C6EB7] transition-colors"
            >
              <Linkedin size={20}/>
            </a>
        </div>
        <a href="mailto:contato@felipegomesdsg.com" className="text-[#716C7A] text-sm hover:text-[#8C6EB7] transition-colors">
           contato@felipegomesdsg.com
        </a>
      </footer>
    </section>
  );
};

export default Contact;