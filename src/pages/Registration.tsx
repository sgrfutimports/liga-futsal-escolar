import React, { useState, useRef, useEffect } from "react";
import { Upload, Send, CheckCircle2, AlertCircle, Plus, Trash2, Camera, Shield, Download, Trophy, User, Phone, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { getStoredData, setStoredData, resizeImage, supaFetch, supaUpsert } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";

interface AthleteForm {
  id: string;
  name: string;
  number: string;
  category: string;
}

interface FormData {
  schoolName: string;
  cnpj: string;
  city: string;
  respName: string;
  phone: string;
  email: string;
  categories: string[];
  logo: string;
  athletes: AthleteForm[];
  password?: string;
}

interface FormErrors {
  schoolName?: string;
  city?: string;
  respName?: string;
  phone?: string;
  email?: string;
  password?: string;
  categories?: string;
}

export default function Registration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await supaFetch('lfe_settings');
      if (data && data.length > 0) setSettings(data[0]);
      else setSettings(getStoredData('settings'));
    };
    loadSettings();
  }, []);

  const rulesUrl = settings.rules_url || settings.rulesUrl;
  const rulesName = settings.rules_name || settings.rulesName || "Baixar Regulamento PDF";
  
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    cnpj: "",
    city: "",
    respName: "",
    phone: "",
    email: "",
    categories: [],
    logo: "",
    athletes: [],
    password: ""
  });
  const [athleteSubmissionType, setAthleteSubmissionType] = useState<"now" | "later">("now");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const inputClass = "w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 text-white transition-all placeholder:text-gray-700 font-display font-bold text-sm shadow-inner";

  const validateField = (name: string, value: any) => {
    let error = "";
    switch (name) {
      case "schoolName":
        if (!value) error = "Nome da escola é obrigatório";
        else if (value.length < 3) error = "Nome muito curto";
        break;
      case "city":
        if (!value) error = "Cidade é obrigatória";
        break;
      case "respName":
        if (!value) error = "Nome do responsável é obrigatório";
        break;
      case "phone":
        const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
        if (!value) error = "WhatsApp é obrigatório";
        else if (!phoneRegex.test(value)) error = "Formato: (87) 98888-7777";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = "E-mail é obrigatório";
        else if (!emailRegex.test(value)) error = "E-mail inválido";
        break;
      case "password":
        if (!value) error = "Senha é obrigatória";
        else if (value.length < 4) error = "Mínimo 4 caracteres";
        break;
      case "categories":
        if (value.length === 0) error = "Selecione pelo menos uma categoria";
        break;
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (touched[id]) {
      setErrors(prev => ({ ...prev, [id]: validateField(id, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    setErrors(prev => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleCategoryChange = (cat: string) => {
    const newCategories = formData.categories.includes(cat)
      ? formData.categories.filter(c => c !== cat)
      : [...formData.categories, cat];
    
    const keptAthletes = formData.athletes.filter(a => newCategories.includes(a.category));
    
    setFormData(prev => ({ ...prev, categories: newCategories, athletes: keptAthletes }));
    setTouched(prev => ({ ...prev, categories: true }));
    setErrors(prev => ({ ...prev, categories: validateField("categories", newCategories) }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      resizeImage(file, 400, 400).then(base64 => {
        setFormData(prev => ({ ...prev, logo: base64 }));
      });
    }
  };

  const addAthlete = (category: string) => {
    setFormData(prev => ({
      ...prev,
      athletes: [...prev.athletes, { id: Math.random().toString(36).substring(7), name: "", number: "", category }]
    }));
  };

  const updateAthlete = (id: string, field: keyof AthleteForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      athletes: prev.athletes.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const removeAthlete = (id: string) => {
    setFormData(prev => ({
      ...prev,
      athletes: prev.athletes.filter(a => a.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key]);
      if (error) (newErrors as any)[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        school: formData.schoolName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        resp: formData.respName,
        city: formData.city,
        status: "Pendente",
        logo: formData.logo,
        categories: formData.categories.join(', '),
        cnpj: formData.cnpj,
        phone: formData.phone,
        created_at: new Date().toISOString()
      };

      const { data: reg, error: regError } = await supabase
        .from('lfe_registrations')
        .upsert(registrationData)
        .select()
        .single();

      if (regError) throw regError;

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Erro ao salvar inscrição:", err);
      alert("Erro ao enviar inscrição: " + (err.message || "Verifique sua conexão"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#020617] py-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center shadow-3xl backdrop-blur-3xl"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(204,255,0,0.3)] border border-primary/50">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-display text-white font-black uppercase tracking-tighter mb-6 leading-none">Inscrição Enviada!</h2>
          <p className="text-gray-400 mb-12 leading-relaxed uppercase font-bold tracking-tight text-sm opacity-60">
            Recebemos a ficha da escola <strong className="text-white">{formData.schoolName}</strong>. A organização analisará e entrará em contato via WhatsApp.
          </p>
          <button onClick={() => window.location.reload()} className="w-full px-8 py-5 bg-primary text-dark font-display text-lg rounded-2xl font-black hover:scale-[1.02] transition-all uppercase tracking-widest shadow-2xl">
            Nova Inscrição
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-30" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-500 font-display text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Trophy className="w-4 h-4 text-primary" /> Novo Credenciamento
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter mb-8 leading-none"
          >
            Inscrever <span className="text-primary italic">Equipe</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto font-medium uppercase tracking-widest opacity-60 mb-12"
          >
            Plataforma oficial de registros para a temporada {settings.yearEdition || "2026"}.
          </motion.p>
          
          {rulesUrl && (
            <motion.a 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              href={rulesUrl} 
              download={rulesName} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-primary/50 text-gray-400 hover:text-primary font-display uppercase tracking-widest text-xs font-black rounded-2xl transition-all shadow-2xl"
            >
              <Download className="w-5 h-5 text-primary" />
              {rulesName}
            </motion.a>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pb-40">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.03] border border-white/10 rounded-[4rem] p-8 md:p-20 shadow-[0_0_100px_rgba(0,0,0,0.3)] backdrop-blur-3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-24">
            
            {/* Step 1: Instituição */}
            <div className="space-y-12">
               <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary text-dark font-display font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20">1</div>
                 <h2 className="text-4xl font-display font-black uppercase tracking-tighter text-white leading-none">Dados da <span className="text-primary italic">Instituição</span></h2>
               </div>
               
               <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex flex-col items-center gap-4">
                     <div 
                       className="w-40 h-40 md:w-56 md:h-56 bg-dark border-2 border-dashed border-white/10 rounded-[3rem] flex items-center justify-center relative group overflow-hidden cursor-pointer hover:border-primary/50 transition-all shadow-2xl"
                       onClick={() => fileInputRef.current?.click()}
                     >
                       {formData.logo ? (
                         <img src={formData.logo} className="w-full h-full object-contain p-4 bg-white" alt="Logo" />
                       ) : (
                         <div className="text-center p-6">
                           <Shield className="w-12 h-12 text-gray-800 mx-auto mb-4 group-hover:text-primary transition-colors opacity-20" />
                           <span className="text-[10px] text-gray-600 font-display font-black uppercase tracking-widest">Enviar Escudo</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Camera className="w-10 h-10 text-white" />
                       </div>
                     </div>
                     <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="relative group/field">
                      <label htmlFor="schoolName" className="block text-[10px] font-black text-gray-600 mb-3 uppercase tracking-[0.3em]">Nome da Escola / Projeto</label>
                      <input type="text" id="schoolName" value={formData.schoolName} onChange={handleInputChange} onBlur={handleBlur}
                        className={cn(inputClass, errors.schoolName && touched.schoolName && "border-red-500/50 bg-red-500/5")} placeholder="Ex: Escola Estadual Machado de Assis" />
                      {errors.schoolName && touched.schoolName && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tight flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.schoolName}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="relative group/field">
                          <label htmlFor="city" className="block text-[10px] font-black text-gray-600 mb-3 uppercase tracking-[0.3em]">Cidade Sede</label>
                          <input type="text" id="city" value={formData.city} onChange={handleInputChange} onBlur={handleBlur}
                            className={cn(inputClass, errors.city && touched.city && "border-red-500/50 bg-red-500/5")} placeholder="Sua cidade" />
                          {errors.city && touched.city && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tight flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.city}</p>}
                       </div>
                       <div className="relative group/field">
                          <label htmlFor="cnpj" className="block text-[10px] font-black text-gray-600 mb-3 uppercase tracking-[0.3em]">CNPJ (Opcional)</label>
                          <input type="text" id="cnpj" value={formData.cnpj} onChange={handleInputChange} className={inputClass} placeholder="00.000.000/0000-00" />
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Step 2: Responsável */}
            <div className="space-y-12">
               <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary text-dark font-display font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20">2</div>
                 <h2 className="text-4xl font-display font-black uppercase tracking-tighter text-white leading-none">Responsável <span className="text-primary italic">Técnico</span></h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group/field">
                    <label htmlFor="respName" className="block text-[10px] font-black text-gray-600 mb-3 uppercase tracking-[0.3em]">Nome Completo</label>
                    <div className="relative">
                       <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                       <input type="text" id="respName" value={formData.respName} onChange={handleInputChange} onBlur={handleBlur}
                         className={cn(inputClass, "pl-14", errors.respName && touched.respName && "border-red-500/50 bg-red-500/5")} placeholder="Treinador ou Gestor" />
                    </div>
                    {errors.respName && touched.respName && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tight flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.respName}</p>}
                  </div>
                  
                  <div className="relative group/field">
                    <label htmlFor="phone" className="block text-[10px] font-black text-gray-600 mb-3 uppercase tracking-[0.3em]">WhatsApp Oficial</label>
                    <div className="relative">
                       <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                       <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur}
                         className={cn(inputClass, "pl-14", errors.phone && touched.phone && "border-red-500/50 bg-red-500/5")} placeholder="(87) 90000-0000" />
                    </div>
                    {errors.phone && touched.phone && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tight flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                  </div>

                  <div className="relative group/field">
                    <label htmlFor="email" className="block text-[10px] font-black text-gray-600 mb-3 uppercase tracking-[0.3em]">E-mail Corporativo</label>
                    <div className="relative">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                       <input type="email" id="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur}
                         className={cn(inputClass, "pl-14", errors.email && touched.email && "border-red-500/50 bg-red-500/5")} placeholder="email@exemplo.com" />
                    </div>
                    {errors.email && touched.email && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tight flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                  </div>

                  <div className="relative group/field">
                    <label htmlFor="password" className="block text-[10px] font-black text-gray-600 mb-3 uppercase tracking-[0.3em]">Senha de Acesso</label>
                    <div className="relative">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                       <input type="password" id="password" value={formData.password} onChange={handleInputChange} onBlur={handleBlur}
                         className={cn(inputClass, "pl-14", errors.password && touched.password && "border-red-500/50 bg-red-500/5")} placeholder="Mínimo 4 caracteres" />
                    </div>
                    {errors.password && touched.password && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-tight flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</p>}
                  </div>
               </div>
            </div>

            {/* Step 3: Categorias */}
            <div className="space-y-12">
               <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary text-dark font-display font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20">3</div>
                 <h2 className="text-4xl font-display font-black uppercase tracking-tighter text-white leading-none">Categorias <span className="text-primary italic">Disputadas</span></h2>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {(settings.categories ? String(settings.categories).split(',') : ["SUB-11", "SUB-12", "SUB-13", "SUB-14", "SUB-15", "SUB-16", "SUB-17", "SUB-18"]).map((catRaw) => {
                    const cat = catRaw.trim();
                    const isSelected = formData.categories.includes(cat);
                    return (
                      <motion.label 
                        key={cat} 
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "flex flex-col items-center justify-center p-8 border-2 rounded-[2.5rem] cursor-pointer transition-all duration-500 relative",
                          isSelected ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" : "border-white/5 bg-white/5 hover:border-white/20"
                        )}
                      >
                        <input type="checkbox" className="absolute opacity-0 w-0 h-0" checked={isSelected} onChange={() => handleCategoryChange(cat)} />
                        <div className={cn("w-8 h-8 border-2 rounded-full mb-6 flex items-center justify-center transition-all", isSelected ? "border-primary bg-primary" : "border-gray-800")}>
                           {isSelected && <CheckCircle2 className="w-5 h-5 text-dark" />}
                        </div>
                        <span className={cn("font-display text-2xl font-black transition-colors uppercase tracking-tighter", isSelected ? "text-primary" : "text-gray-600")}>{cat}</span>
                      </motion.label>
                    );
                  })}
               </div>
               {errors.categories && touched.categories && (
                 <p className="mt-8 text-sm text-red-500 font-black uppercase tracking-widest flex items-center justify-center gap-2"><AlertCircle className="w-5 h-5" /> {errors.categories}</p>
               )}
            </div>

            {/* Step 4: Atletas */}
            {formData.categories.length > 0 && (
              <div className="space-y-12">
                 <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-primary text-dark font-display font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20">4</div>
                   <h2 className="text-4xl font-display font-black uppercase tracking-tighter text-white leading-none">Relação de <span className="text-primary italic">Atletas</span></h2>
                 </div>

                 <div className="flex flex-col md:flex-row gap-6">
                    <button 
                      type="button"
                      onClick={() => setAthleteSubmissionType("now")}
                      className={cn(
                        "flex-1 p-8 border-2 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 text-center",
                        athleteSubmissionType === "now" ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 opacity-40"
                      )}
                    >
                       <Plus className={cn("w-10 h-10", athleteSubmissionType === "now" ? "text-primary" : "text-gray-600")} />
                       <span className={cn("font-display font-black text-lg uppercase tracking-tighter", athleteSubmissionType === "now" ? "text-white" : "text-gray-600")}>Inserir Elenco Agora</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAthleteSubmissionType("later")}
                      className={cn(
                        "flex-1 p-8 border-2 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 text-center",
                        athleteSubmissionType === "later" ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 opacity-40"
                      )}
                    >
                       <Clock className={cn("w-10 h-10", athleteSubmissionType === "later" ? "text-primary" : "text-gray-600")} />
                       <span className={cn("font-display font-black text-lg uppercase tracking-tighter", athleteSubmissionType === "later" ? "text-white" : "text-gray-600")}>Enviar Posteriormente</span>
                    </button>
                 </div>

                 <AnimatePresence>
                    {athleteSubmissionType === "now" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-8"
                      >
                         {formData.categories.map(cat => {
                           const catAthletes = formData.athletes.filter(a => a.category === cat);
                           return (
                             <div key={cat} className="bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl">
                                <div className="flex items-center justify-between mb-10">
                                   <h4 className="font-display text-3xl font-black text-primary uppercase tracking-tighter italic">{cat}</h4>
                                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{catAthletes.length} ATLETAS</span>
                                </div>

                                <div className="space-y-4 mb-10">
                                   {catAthletes.map((athlete, idx) => (
                                     <div key={athlete.id} className="flex flex-col sm:flex-row gap-6 items-center bg-white/5 p-6 rounded-[2rem] border border-white/5 group hover:border-primary/30 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-dark/50 border border-white/10 text-gray-600 font-display font-black flex items-center justify-center shrink-0">{idx + 1}</div>
                                        <div className="flex-grow w-full">
                                           <input 
                                             type="text" 
                                             placeholder="Nome Completo do Atleta"
                                             value={athlete.name}
                                             onChange={e => updateAthlete(athlete.id, 'name', e.target.value)}
                                             className="w-full bg-transparent border-b-2 border-white/10 focus:border-primary transition-all py-3 px-2 text-white font-display font-black uppercase tracking-tight text-lg outline-none placeholder:text-gray-800"
                                           />
                                        </div>
                                        <div className="w-24 shrink-0">
                                           <input 
                                             type="number" 
                                             placeholder="Nº"
                                             value={athlete.number}
                                             onChange={e => updateAthlete(athlete.id, 'number', e.target.value)}
                                             className="w-full bg-transparent border-b-2 border-white/10 focus:border-primary transition-all py-3 px-2 text-primary font-display font-black text-center text-xl outline-none"
                                           />
                                        </div>
                                        <button 
                                          type="button" 
                                          onClick={() => removeAthlete(athlete.id)}
                                          className="p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                        >
                                           <Trash2 className="w-5 h-5" />
                                        </button>
                                     </div>
                                   ))}
                                   {catAthletes.length === 0 && (
                                     <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem] text-gray-700 font-display font-black uppercase tracking-widest text-xs">
                                        Nenhum atleta listado
                                     </div>
                                   )}
                                </div>

                                <button 
                                  type="button" 
                                  onClick={() => addAthlete(cat)}
                                  className="w-full py-6 rounded-[2rem] border-2 border-dashed border-primary/20 text-primary font-display font-black uppercase tracking-widest text-xs hover:bg-primary/5 hover:border-primary/50 transition-all flex items-center justify-center gap-3"
                                >
                                   <Plus className="w-5 h-5" /> Adicionar Atleta ao {cat}
                                </button>
                             </div>
                           )
                         })}
                      </motion.div>
                    )}
                 </AnimatePresence>

                 {athleteSubmissionType === "later" && (
                    <div className="p-10 rounded-[3rem] bg-primary/10 border border-primary/20 text-center">
                       <p className="text-gray-400 font-display font-black uppercase tracking-tight text-xl leading-none">
                          <span className="text-primary italic block mb-2 text-sm tracking-widest opacity-60">Aviso Estratégico</span>
                          O elenco poderá ser enviado posteriormente através do Painel do Gestor após a aprovação da escola.
                       </p>
                    </div>
                 )}
              </div>
            )}

            {/* Submit Area */}
            <div className="pt-20 border-t-2 border-white/5">
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full py-8 bg-primary text-dark font-display text-3xl font-black uppercase tracking-tighter rounded-[3rem] hover:scale-[1.02] transition-all shadow-3xl shadow-primary/20 relative group overflow-hidden disabled:opacity-50"
               >
                  <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-1000"></span>
                  <div className="relative flex items-center justify-center gap-4">
                    {isSubmitting ? (
                      <div className="w-8 h-8 border-4 border-dark border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <>
                        <Send className="w-8 h-8" />
                        Finalizar e Enviar Credenciamento
                      </>
                    )}
                  </div>
               </button>
               <div className="mt-10 text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] space-y-2">
                 <p>Ao realizar a inscrição, você aceita o Regulamento Geral da Temporada {settings.yearEdition || "2026"}.</p>
                 <p>Ambiente seguro e criptografado {settings.leagueName || "Liga de Futsal Escolar"}.</p>
               </div>
            </div>
          </form>
        </motion.div>
      </main>

    </div>
  );
}
