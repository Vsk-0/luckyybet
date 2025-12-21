import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generatePixPayment, checkPixPaymentStatus } from '../services/pixService';
import { useNavigate } from 'react-router-dom';
import { QrCode, Copy, CheckCircle, Clock } from 'lucide-react';

const DepositPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pixData, setPixData] = useState<{
    transactionId: string;
    pixKey: string;
    qrCode: string;
    expiresAt: Date;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleGeneratePixPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Você precisa estar logado para fazer um depósito.');
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Por favor, insira um valor de depósito válido.');
      return;
    }

    if (depositAmount < 2) {
      setError('O valor mínimo para depósito é R$ 2,00.');
      return;
    }

    if (depositAmount > 10000) {
      setError('O valor máximo para depósito é R$ 10.000,00.');
      return;
    }

    setLoading(true);
    try {
      const response = await generatePixPayment({
        userId: currentUser.id,
        amount: depositAmount,
        description: 'Depósito na plataforma LuckyYBet',
        userEmail: currentUser.email || '',
      });

      if (response.success && response.transactionId && response.pixKey && response.qrCode && response.expiresAt) {
        setPixData({
          transactionId: response.transactionId,
          pixKey: response.pixKey,
          qrCode: response.qrCode,
          expiresAt: response.expiresAt,
        });
      } else {
        setError(response.error || 'Falha ao gerar pagamento PIX. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao gerar PIX:', err);
      setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPixKey = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCheckStatus = async () => {
    if (!pixData) return;

    setCheckingStatus(true);
    try {
      const status = await checkPixPaymentStatus(pixData.transactionId);
      
      if (status === 'approved') {
        alert('✅ Pagamento confirmado! Seu saldo foi atualizado.');
        navigate('/dashboard');
      } else if (status === 'rejected') {
        setError('❌ Pagamento rejeitado. Tente novamente.');
        setPixData(null);
      } else {
        alert('⏳ Pagamento ainda pendente. Aguarde a confirmação.');
      }
    } catch (err) {
      console.error('Erro ao verificar status:', err);
      setError('Erro ao verificar status do pagamento.');
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">Depositar via PIX</h1>
      
      <div className="max-w-2xl mx-auto">
        {!pixData ? (
          // Formulário de Valor
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            {error && (
              <div className="bg-red-900 text-white p-3 rounded mb-4 flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleGeneratePixPayment}>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-semibold" htmlFor="amount">
                  Valor do Depósito
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-lg">R$</span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="2"
                    max="10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    placeholder="0,00"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Mínimo: R$ 2,00 | Máximo: R$ 10.000,00
                </p>
              </div>

              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
                <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                  <QrCode className="mr-2" size={20} />
                  Como funciona?
                </h3>
                <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                  <li>Insira o valor que deseja depositar</li>
                  <li>Será gerado um QR Code PIX para pagamento</li>
                  <li>Pague usando o app do seu banco</li>
                  <li>Seu saldo será atualizado automaticamente</li>
                </ol>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Gerando PIX...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2" size={20} />
                    Gerar QR Code PIX
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          // Exibição do QR Code PIX
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
                <CheckCircle className="text-green-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">PIX Gerado com Sucesso!</h2>
              <p className="text-gray-400 mt-2">Escaneie o QR Code ou copie o código abaixo</p>
            </div>

            {/* QR Code Simulado */}
            <div className="bg-white p-6 rounded-lg mb-6 flex justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                <QrCode size={200} className="text-gray-700" />
              </div>
            </div>

            {/* Código PIX Copia e Cola */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-semibold">
                Código PIX Copia e Cola
              </label>
              <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 flex items-center justify-between">
                <p className="text-white font-mono text-sm break-all flex-1 mr-2">
                  {pixData.qrCode.substring(0, 50)}...
                </p>
                <button
                  onClick={handleCopyPixKey}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition flex-shrink-0"
                  title="Copiar código"
                >
                  {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-sm mt-2 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  Código copiado!
                </p>
              )}
            </div>

            {/* Informações Adicionais */}
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
              <h3 className="text-yellow-300 font-semibold mb-2 flex items-center">
                <Clock className="mr-2" size={20} />
                Informações Importantes
              </h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Valor: <span className="font-bold text-white">R$ {amount}</span></li>
                <li>• Expira em: <span className="font-bold text-white">30 minutos</span></li>
                <li>• Status: <span className="text-yellow-400 font-bold">Aguardando Pagamento</span></li>
              </ul>
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCheckStatus}
                disabled={checkingStatus}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              >
                {checkingStatus ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verificando...
                  </>
                ) : (
                  'Já Paguei'
                )}
              </button>
              <button
                onClick={() => {
                  setPixData(null);
                  setAmount('');
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Cancelar
              </button>
            </div>

            {/* Nota de Simulação */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                ⚠️ Modo de Simulação Educacional - Pagamento não será processado
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;
