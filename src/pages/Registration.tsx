import React, { useState, useRef } from "react";
import { Upload, Send, CheckCircle2, AlertCircle, Plus, Trash2, Camera, Shield, Download } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getStoredData, setStoredData, resizeImage } from "@/src/lib/store";

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
}

interface FormErrors {
  schoolName?: string;
  city?: string;
  respName?: string;
  phone?: string;
  email?: string;
  categories?: string;
}

export default function Registration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const settings = getStoredData('settings') || {};
  const rulesUrl = settings.rulesUrl;
  const rulesName = settings.rulesName || "Baixar Regulamento PDF";
  
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    cnpj: "",
    city: "",
    respName: "",
    phone: "",
    email: "",
    categories: [],
    logo: "",
    athletes: []
  });
  const [athleteSubmissionType, setAthleteSubmissionType] = useState<"now" | "later">("now");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const inputClass = "w-full px-4 py-3 bg-dark border border-dark-border rounded focus:outline-none focus:border-primary text-white transition-colors placeholder-gray-600";

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
    
    // Automatically remove athletes that belonged to the unchecked category
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, (formData as any)[key]);
      if (error) (newErrors as any)[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate save to local store
    setIsSubmitted(true);
    setTimeout(() => {
      const storedRegistrations = getStoredData('registrations') || [];
      const newReg = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        school: formData.schoolName,
        resp: formData.respName,
        status: "Pendente",
        logo: formData.logo,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        categories: formData.categories.join(', '),
        athletes: athleteSubmissionType === "now" ? formData.athletes.map(a => ({ ...a, id: Date.now() + Math.random() })) : [],
        athleteSubmissionType
      };
      setStoredData('registrations', [...storedRegistrations, newReg]);
    }, 500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark py-20 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-xl p-8 text-center shadow-2xl">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-display text-white mb-4 uppercase">Inscrição Enviada!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Recebemos a ficha da escola <strong>{formData.schoolName}</strong> com {formData.athletes.length} atletas cadastrados. A organização analisará a composição e enviará as confirmações via WhatsApp.
          </p>
          <button onClick={() => window.location.reload()} className="w-full px-6 py-4 bg-primary text-dark font-display text-lg rounded font-bold hover:bg-primary-dark transition-colors uppercase">
            Nova Inscrição
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12 lg:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 uppercase">
            INSCREVA SUA <span className="text-primary">EQUIPE</span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Plataforma oficial de registros. Preencha os dados institucionais e relacione os seus atletas.
          </p>
          
          {rulesUrl && (
            <a href={rulesUrl} download={rulesName} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-dark-card border border-dark-border hover:border-primary text-gray-300 hover:text-primary font-display uppercase tracking-widest text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(255,255,15,0.02)] hover:shadow-[0_0_15px_rgba(118,169,17,0.1)]">
              <Download className="w-5 h-5" />
              {rulesName}
            </a>
          )}
        </div>

        {/* Form Container */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-12 shadow-xl shadow-primary/5">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Instituição */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl text-white border-b border-dark-border pb-3 flex items-center gap-3 uppercase">
                <span className="bg-primary text-dark w-8 h-8 flex items-center justify-center rounded text-lg">1</span> 
                Dados da Instituição
              </h3>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Logo Uploader */}
                <div className="flex flex-col items-center gap-3">
                   <div className="w-32 h-32 md:w-40 md:h-40 bg-dark border-2 border-dashed border-dark-border rounded-xl flex items-center justify-center relative group overflow-hidden cursor-pointer hover:border-primary transition-colors"
                        onClick={() => fileInputRef.current?.click()}>
                     {formData.logo ? (
                       <img src={formData.logo} className="w-full h-full object-contain p-2 bg-white" alt="Logo" />
                     ) : (
                       <div className="text-center p-4">
                         <Shield className="w-10 h-10 text-gray-500 mx-auto mb-2 group-hover:text-primary transition-colors" />
                         <span className="text-[10px] text-gray-400 font-display uppercase">Enviar Escudo</span>
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Camera className="w-8 h-8 text-white" />
                     </div>
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                </div>
                
                {/* School Inputs */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label htmlFor="schoolName" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Nome da Escola / Projeto <span className="text-danger">*</span></label>
                    <input type="text" id="schoolName" value={formData.schoolName} onChange={handleInputChange} onBlur={handleBlur}
                      className={cn(inputClass, errors.schoolName && touched.schoolName && "border-danger bg-danger/5")} placeholder="Ex: Escola Estadual Machado de Assis" />
                    {errors.schoolName && touched.schoolName && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.schoolName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Cidade <span className="text-danger">*</span></label>
                      <input type="text" id="city" value={formData.city} onChange={handleInputChange} onBlur={handleBlur}
                        className={cn(inputClass, errors.city && touched.city && "border-danger bg-danger/5")} placeholder="Sua cidade" />
                      {errors.city && touched.city && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="cnpj" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">CNPJ (Opcional)</label>
                      <input type="text" id="cnpj" value={formData.cnpj} onChange={handleInputChange} className={inputClass} placeholder="00.000.000/0000-00" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Contato */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl text-white border-b border-dark-border pb-3 flex items-center gap-3 uppercase">
                <span className="bg-primary text-dark w-8 h-8 flex items-center justify-center rounded text-lg">2</span> 
                Responsável Técnico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="respName" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Nome Completo <span className="text-danger">*</span></label>
                  <input type="text" id="respName" value={formData.respName} onChange={handleInputChange} onBlur={handleBlur}
                    className={cn(inputClass, errors.respName && touched.respName && "border-danger bg-danger/5")} placeholder="Treinador ou Gestor" />
                  {errors.respName && touched.respName && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.respName}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">WhatsApp / Telefone <span className="text-danger">*</span></label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur}
                    className={cn(inputClass, errors.phone && touched.phone && "border-danger bg-danger/5")} placeholder="(87) 90000-0000" />
                  {errors.phone && touched.phone && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">E-mail de Contato <span className="text-danger">*</span></label>
                  <input type="email" id="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur}
                    className={cn(inputClass, errors.email && touched.email && "border-danger bg-danger/5")} placeholder="email@exemplo.com" />
                  {errors.email && touched.email && <p className="mt-1 text-xs text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Modalidades */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl text-white border-b border-dark-border pb-3 flex items-center gap-3 uppercase">
                <span className="bg-primary text-dark w-8 h-8 flex items-center justify-center rounded text-lg">3</span> 
                Categorias Disputadas
              </h3>
              <div id="categories" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["SUB-11", "SUB-13", "SUB-15", "SUB-17"].map((cat) => {
                  const isSelected = formData.categories.includes(cat);
                  return (
                    <label key={cat} className={cn(
                      "flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 relative",
                      isSelected ? "border-primary bg-primary/10" : "border-dark-border bg-dark hover:border-gray-500",
                      errors.categories && touched.categories && !isSelected && "border-danger/50"
                    )}>
                      <input type="checkbox" className="absolute opacity-0 w-0 h-0" checked={isSelected} onChange={() => handleCategoryChange(cat)} />
                      <div className={cn("w-6 h-6 border-2 rounded-full mb-3 flex items-center justify-center transition-colors", isSelected ? "border-primary bg-primary" : "border-gray-500")}>
                         {isSelected && <CheckCircle2 className="w-4 h-4 text-dark" />}
                      </div>
                      <span className={cn("font-display text-xl transition-colors", isSelected ? "text-primary" : "text-gray-400")}>{cat}</span>
                    </label>
                  );
                })}
              </div>
              {errors.categories && touched.categories && (
                <p className="mt-2 text-sm text-danger flex items-center gap-1 justify-center"><AlertCircle className="w-4 h-4" /> {errors.categories}</p>
              )}
            </div>

            {/* Section 4: Relação de Atletas */}
            {formData.categories.length > 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="font-display text-2xl text-white border-b border-dark-border pb-3 flex items-center gap-3 uppercase">
                  <span className="bg-primary text-dark w-8 h-8 flex items-center justify-center rounded text-lg">4</span> 
                  Relação de Atletas
                </h3>
                
                <div className="flex gap-4 mb-6">
                  <label className={cn("flex-1 p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3", athleteSubmissionType === "now" ? "border-primary bg-primary/10" : "border-dark-border bg-dark hover:border-gray-500")}>
                     <input type="radio" name="athleteSub" className="accent-primary w-4 h-4" checked={athleteSubmissionType === "now"} onChange={() => setAthleteSubmissionType("now")} />
                     <span className={cn("font-display text-sm md:text-base", athleteSubmissionType === "now" ? "text-primary" : "text-gray-400")}>INSERIR ELENCO AGORA</span>
                  </label>
                  <label className={cn("flex-1 p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3", athleteSubmissionType === "later" ? "border-primary bg-primary/10" : "border-dark-border bg-dark hover:border-gray-500")}>
                     <input type="radio" name="athleteSub" className="accent-primary w-4 h-4" checked={athleteSubmissionType === "later"} onChange={() => setAthleteSubmissionType("later")} />
                     <span className={cn("font-display text-sm md:text-base", athleteSubmissionType === "later" ? "text-primary" : "text-gray-400")}>ENVIAR DEPOIS DA HOMOLOGAÇÃO</span>
                  </label>
                </div>

                {athleteSubmissionType === "now" && formData.categories.map(cat => {
                  const catAthletes = formData.athletes.filter(a => a.category === cat);
                  
                  return (
                    <div key={cat} className="bg-dark border border-dark-border rounded-xl p-5 md:p-6 shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-dark-border px-4 py-1 font-display text-xs text-gray-400 rounded-bl-xl origin-top-right">
                        Categoria
                      </div>
                      <h4 className="font-display text-primary text-2xl uppercase mb-6">{cat}</h4>
                      
                      {catAthletes.length > 0 ? (
                        <div className="space-y-3 mb-4">
                          {catAthletes.map((athlete, idx) => (
                            <div key={athlete.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-dark-card p-3 rounded-lg border border-dark-border group transition-all hover:border-primary/50">
                              <div className="bg-dark px-3 py-2 font-display text-gray-500 rounded text-sm w-8 text-center shrink-0 border border-dark-border">{idx + 1}</div>
                              <div className="flex-1 w-full">
                                <input type="text" required placeholder="Nome Completo do Atleta" value={athlete.name} onChange={e => updateAthlete(athlete.id, 'name', e.target.value)}
                                  className="w-full bg-transparent border-b border-dark-border focus:border-primary px-2 py-1 text-white text-sm outline-none transition-colors placeholder-gray-600" />
                              </div>
                              <div className="w-full sm:w-24 shrink-0">
                                <input type="number" required placeholder="Nº Camisa" value={athlete.number} onChange={e => updateAthlete(athlete.id, 'number', e.target.value)}
                                  className="w-full bg-transparent border-b border-dark-border focus:border-primary px-2 py-1 text-primary font-display text-center outline-none transition-colors placeholder-gray-600" />
                              </div>
                              <button type="button" onClick={() => removeAthlete(athlete.id)} className="w-full sm:w-auto p-2 text-danger hover:bg-danger/10 rounded flex items-center justify-center transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 font-sans text-sm italic border border-dashed border-dark-border rounded-lg mb-4">
                          Nenhum atleta cadastrado no {cat} ainda.
                        </div>
                      )}
                      
                      <button type="button" onClick={() => addAthlete(cat)} className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border text-primary font-display text-sm rounded hover:bg-primary/10 transition-colors">
                        <Plus className="w-4 h-4" /> ADICIONAR ATLETA
                      </button>
                    </div>
                  );
                })}
                {athleteSubmissionType === "later" && (
                   <div className="text-gray-400 text-sm font-sans bg-dark-card border border-dark-border p-4 rounded-lg">
                      <strong className="text-primary font-bold">Aviso:</strong> Ao prosseguir assim, a equipe gestora avaliará a ficha da escola. Quando for aprovada (homologada), a lista do elenco será enviada e regularizada posteriormente!
                   </div>
                )}
                {athleteSubmissionType === "now" && (
                  <p className="text-xs text-gray-500 font-sans py-2">
                    <span className="text-primary font-bold">Nota:</span> As fotos individuais dos atletas poderão ser enviadas posteriormente pelo gestor através do painel.
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="pt-8 border-t border-dark-border">
              <button type="submit" className="w-full py-5 bg-primary text-dark font-display text-2xl uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all transform hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(153,204,0,0.3)] shadow-xl flex items-center justify-center gap-3 relative overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-[shimmer_1.5s_infinite]"></span>
                <Send className="w-7 h-7" />
                EFETUAR INSCRIÇÃO AGORA
              </button>
              <div className="mt-4 flex flex-col items-center text-center text-gray-400 text-xs font-sans">
                <p>Ao realizar a inscrição, a escola concorda com os <strong>Termos e Regulamento Geral da Competição</strong>.</p>
                <p className="mt-1">Todos os dados estão seguros e protegidos segundo as normas de privacidade.</p>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
