import React, { useState, useEffect } from "react";
import { Upload, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface FormData {
  schoolName: string;
  cnpj: string;
  city: string;
  respName: string;
  phone: string;
  email: string;
  categories: string[];
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
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    cnpj: "",
    city: "",
    respName: "",
    phone: "",
    email: "",
    categories: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: any) => {
    let error = "";
    switch (name) {
      case "schoolName":
        if (!value) error = "Nome da escola é obrigatório";
        else if (value.length < 3) error = "Nome muito curto (mínimo 3 caracteres)";
        break;
      case "city":
        if (!value) error = "Cidade é obrigatória";
        break;
      case "respName":
        if (!value) error = "Nome do responsável é obrigatório";
        else if (value.length < 3) error = "Nome muito curto";
        break;
      case "phone":
        const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
        if (!value) error = "WhatsApp é obrigatório";
        else if (!phoneRegex.test(value)) error = "Formato inválido: (87) 98888-7777";
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
      const error = validateField(id, value);
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    const error = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleCategoryChange = (cat: string) => {
    const newCategories = formData.categories.includes(cat)
      ? formData.categories.filter(c => c !== cat)
      : [...formData.categories, cat];
    
    setFormData(prev => ({ ...prev, categories: newCategories }));
    setTouched(prev => ({ ...prev, categories: true }));
    const error = validateField("categories", newCategories);
    setErrors(prev => ({ ...prev, categories: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
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

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark py-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-display text-white mb-4">INSCRIÇÃO ENVIADA!</h2>
          <p className="text-gray-400 mb-8 font-sans">
            Recebemos os dados da sua escola. Nossa equipe entrará em contato em breve via WhatsApp para confirmar a participação.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full px-6 py-3 bg-primary text-dark font-display text-lg rounded hover:bg-primary-dark transition-colors"
          >
            VOLTAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            INSCREVA SUA <span className="text-primary">ESCOLA</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Preencha o formulário abaixo para registrar sua equipe na próxima temporada da Liga de Futsal Escolar.
          </p>
        </div>

        {/* Form */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Seção 1: Dados da Escola */}
            <div>
              <h3 className="font-display text-xl text-white mb-6 border-b border-dark-border pb-2">1. DADOS DA ESCOLA</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-400 mb-2">Nome da Escola / Projeto</label>
                  <input
                    type="text"
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "w-full px-4 py-3 bg-dark border rounded focus:outline-none text-white transition-colors",
                      errors.schoolName && touched.schoolName ? "border-danger" : "border-dark-border focus:border-primary"
                    )}
                    placeholder="Ex: Colégio Diocesano"
                  />
                  {errors.schoolName && touched.schoolName && (
                    <p className="mt-1 text-xs text-danger flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.schoolName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-gray-400 mb-2">CNPJ (Opcional)</label>
                  <input
                    type="text"
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark border border-dark-border rounded focus:outline-none focus:border-primary text-white transition-colors"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">Cidade</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "w-full px-4 py-3 bg-dark border rounded focus:outline-none text-white transition-colors",
                      errors.city && touched.city ? "border-danger" : "border-dark-border focus:border-primary"
                    )}
                    placeholder="Ex: Garanhuns"
                  />
                  {errors.city && touched.city && (
                    <p className="mt-1 text-xs text-danger flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.city}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Seção 2: Responsável */}
            <div>
              <h3 className="font-display text-xl text-white mb-6 border-b border-dark-border pb-2">2. RESPONSÁVEL TÉCNICO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="respName" className="block text-sm font-medium text-gray-400 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    id="respName"
                    value={formData.respName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "w-full px-4 py-3 bg-dark border rounded focus:outline-none text-white transition-colors",
                      errors.respName && touched.respName ? "border-danger" : "border-dark-border focus:border-primary"
                    )}
                    placeholder="Nome do treinador ou coordenador"
                  />
                  {errors.respName && touched.respName && (
                    <p className="mt-1 text-xs text-danger flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.respName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "w-full px-4 py-3 bg-dark border rounded focus:outline-none text-white transition-colors",
                      errors.phone && touched.phone ? "border-danger" : "border-dark-border focus:border-primary"
                    )}
                    placeholder="(87) 98888-7777"
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-xs text-danger flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={cn(
                      "w-full px-4 py-3 bg-dark border rounded focus:outline-none text-white transition-colors",
                      errors.email && touched.email ? "border-danger" : "border-dark-border focus:border-primary"
                    )}
                    placeholder="contato@escola.com"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-danger flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Seção 3: Categorias */}
            <div>
              <h3 className="font-display text-xl text-white mb-6 border-b border-dark-border pb-2">3. CATEGORIAS DE INTERESSE</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["SUB-11", "SUB-13", "SUB-15", "SUB-17"].map((cat) => (
                  <label key={cat} className={cn(
                    "flex items-center gap-3 p-4 bg-dark border rounded cursor-pointer transition-colors",
                    formData.categories.includes(cat) ? "border-primary bg-primary/5" : "border-dark-border hover:border-primary/50",
                    errors.categories && touched.categories && "border-danger/50"
                  )}>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-primary bg-dark border-dark-border rounded"
                      checked={formData.categories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <span className="font-display text-white">{cat}</span>
                  </label>
                ))}
              </div>
              {errors.categories && touched.categories && (
                <p className="mt-2 text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.categories}
                </p>
              )}
            </div>

            {/* Seção 4: Documentos */}
            <div>
              <h3 className="font-display text-xl text-white mb-6 border-b border-dark-border pb-2">4. DOCUMENTAÇÃO</h3>
              <div className="border-2 border-dashed border-dark-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-dark">
                <Upload className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                <p className="text-white font-display text-lg mb-2">CLIQUE PARA ENVIAR O ESCUDO DA EQUIPE</p>
                <p className="text-gray-500 text-sm font-sans">Formatos aceitos: PNG, JPG (Máx 2MB)</p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4 bg-primary text-dark font-display text-xl rounded hover:bg-primary-dark transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Send className="w-6 h-6" />
                ENVIAR INSCRIÇÃO
              </button>
              <p className="text-center text-gray-500 text-xs mt-4 font-sans">
                Ao enviar, você concorda com o regulamento da competição.
              </p>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
