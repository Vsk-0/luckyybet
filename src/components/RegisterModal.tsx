import React, { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (formData: any) => void;
  onLoginClick: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  onRegister,
  onLoginClick
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    inviteCode: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);

  if (!isOpen) return null;

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 4 caracteres';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phone && !formData.email) {
      newErrors.contact = 'Informe pelo menos um telefone ou email';
    }
    
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'Você deve concordar com os termos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNextStep();
      return;
    }
    
    if (validateStep2()) {
      setIsLoading(true);
      
      // Simulação de registro
      setTimeout(() => {
        setIsLoading(false);
        onRegister(formData);
      }, 1500);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header bg-primary/10">
          <h2 className="modal-title">Cadastre-se</h2>
          <button 
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 ? (
            <>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Digite seu nome de usuário"
                />
                {errors.username && (
                  <div className="form-error">{errors.username}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Digite sua senha"
                />
                {errors.password && (
                  <div className="form-error">{errors.password}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirme sua senha"
                />
                {errors.confirmPassword && (
                  <div className="form-error">{errors.confirmPassword}</div>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full btn-primary mt-4"
              >
                Próximo
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Digite seu telefone"
                />
                {errors.phone && (
                  <div className="form-error">{errors.phone}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Digite seu email"
                />
                {errors.email && (
                  <div className="form-error">{errors.email}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="inviteCode" className="form-label">
                  Código de Convite (opcional)
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Digite o código de convite"
                />
              </div>
              
              <div className="form-group">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="mr-2"
                  />
                  <label htmlFor="agreeTerms" className="text-sm">
                    Concordo com os <a href="#" className="text-primary hover:underline">Termos e Condições</a>
                  </label>
                </div>
                {errors.terms && (
                  <div className="form-error">{errors.terms}</div>
                )}
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 btn-outline"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary"
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            </>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Já tem uma conta?{' '}
              <button 
                type="button"
                onClick={onLoginClick} 
                className="text-primary hover:underline"
              >
                Entrar
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
