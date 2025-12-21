import { useState, useEffect } from 'react';

interface AgeVerificationModalProps {
  onVerified: () => void;
}

const AgeVerificationModal = ({ onVerified }: AgeVerificationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já confirmou a idade
    const ageVerified = localStorage.getItem('ageVerified');
    if (!ageVerified) {
      setIsOpen(true);
    } else {
      onVerified();
    }
  }, [onVerified]);

  const handleYes = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsOpen(false);
    onVerified();
  };

  const handleNo = () => {
    // Redirecionar para uma página de aviso ou bloquear acesso
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">LuckyYBet</h1>
          <div className="h-1 w-20 bg-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Pergunta */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Você possui mais de 18 anos?
          </h2>
          <p className="text-gray-400 text-sm">
            Esta é uma plataforma de simulação educacional
          </p>
        </div>

        {/* Botões */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleNo}
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-gray-900 transition duration-300 transform hover:scale-105"
          >
            NÃO
          </button>
          <button
            onClick={handleYes}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            SIM
          </button>
        </div>

        {/* Aviso Legal */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            ⚠️ Projeto Educacional - Não envolve dinheiro real
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
