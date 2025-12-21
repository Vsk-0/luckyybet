import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createDepositRequest } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const DepositPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  // const [pixKey, setPixKey] = useState(''); // TS6133: 'pixKey' and 'setPixKey' are declared but their values are never read.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Chave Pix fixa para demonstração
  const fixedPixKey = 'chave-pix-exemplo@banco.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) {
      setError('Você precisa estar logado para fazer um depósito.');
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Por favor, insira um valor de depósito válido.');
      return;
    }

    if (depositAmount < 2) { // Valor mínimo de depósito
      setError('O valor mínimo para depósito é R$ 2,00.');
      return;
    }

    setLoading(true);
    try {
      const depositId = await createDepositRequest(currentUser.id, depositAmount, fixedPixKey);
      if (depositId) {
        setSuccess('Solicitação de depósito enviada com sucesso! Aguarde a confirmação.');
        setAmount('');
        // Opcional: redirecionar para o dashboard após um tempo
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        setError('Falha ao enviar solicitação de depósito. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao criar solicitação de depósito:', err);
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">Depositar via Pix</h1>
      
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        {error && (
          <div className="bg-red-900 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900 text-white p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="amount">
              Valor do Depósito (mínimo R$ 2,00)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-500"
              placeholder="Ex: 10.00"
              required
            />
          </div>

          <div className="mb-6">
            <p className="text-gray-400 mb-2">Pague para a chave Pix:</p>
            <div className="bg-gray-700 p-3 rounded border border-gray-600">
              <p className="text-white font-mono break-all">{fixedPixKey}</p>
              {/* Opcional: Adicionar QR Code aqui */}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Após realizar o pagamento, clique no botão abaixo para registrar sua solicitação.
              A confirmação pode levar alguns minutos.
            </p>
          </div>

          {/* Campo para Chave Pix do usuário (se necessário) */}
          {/* 
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="pixKey">
              Sua Chave Pix (para identificação)
            </label>
            <input
              id="pixKey"
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-500"
              placeholder="Sua chave Pix"
            />
          </div>
          */}

          {/* Campo para Upload de Comprovante (Opcional) */}
          {/* 
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="proof">
              Comprovante (Opcional)
            </label>
            <input
              id="proof"
              type="file"
              accept="image/*,.txt,.pdf"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
          */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Enviando Solicitação...' : 'Já Paguei / Solicitar Depósito'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositPage;
