import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useUserData from '../hooks/useUserData';
import { getUserTransactions, Transaction } from '../services/userService';
import { getLimitesUsuario, LimitesUsuario } from '../services/responsibleGaming';
import { Shield, AlertTriangle, CheckCircle, Clock, DollarSign, History, Settings } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [limites, setLimites] = useState<LimitesUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const [userTransactions, userLimits] = await Promise.all([
          getUserTransactions(currentUser.id),
          getLimitesUsuario(currentUser.id)
        ]);
        setTransactions(userTransactions);
        setLimites(userLimits);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-500">Dashboard do Jogador</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Seção de Saldo */}
        <div className="lg:col-span-2 bg-gradient-to-r from-purple-900 to-purple-700 rounded-xl shadow-2xl p-8 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-200 flex items-center">
              <DollarSign className="mr-2" size={24} />
              Saldo Disponível
            </h2>
          </div>
          <p className="text-5xl font-black text-white mb-6">
            R$ {userData?.balance.toFixed(2)}
          </p>
          <div className="flex space-x-4">
            <button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg shadow-green-900/20"
              onClick={() => window.location.href = '/deposit'}
            >
              Depositar
            </button>
            <button 
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg shadow-yellow-900/20"
              onClick={() => window.location.href = '/withdraw'}
            >
              Sacar
            </button>
          </div>
        </div>

        {/* Status de Conformidade (KYC) */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Shield className="mr-2 text-purple-400" size={20} />
            Segurança e Verificação
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <span className="text-gray-400 text-sm">Identidade (KYC):</span>
              {userData?.kyc_status === 'approved' ? (
                <span className="flex items-center text-green-400 text-sm font-bold">
                  <CheckCircle size={16} className="mr-1" /> Verificado
                </span>
              ) : userData?.kyc_status === 'pending' ? (
                <span className="flex items-center text-yellow-400 text-sm font-bold">
                  <Clock size={16} className="mr-1" /> Pendente
                </span>
              ) : (
                <span className="flex items-center text-red-400 text-sm font-bold">
                  <AlertTriangle size={16} className="mr-1" /> Não Iniciado
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <span className="text-gray-400 text-sm">Jogo Responsável:</span>
              <span className="text-green-400 text-sm font-bold">Ativo</span>
            </div>
            {userData?.kyc_status !== 'approved' && (
              <button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-lg shadow-purple-900/20"
                onClick={() => alert('O modal de KYC será aberto automaticamente no próximo registro ou você pode acessar as configurações.')}
              >
                Completar Verificação
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Histórico de Transações */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <History className="mr-2 text-purple-400" size={24} />
            Histórico de Transações
          </h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                    <th className="px-4 py-4 text-left font-medium">Tipo</th>
                    <th className="px-4 py-4 text-left font-medium">Valor</th>
                    <th className="px-4 py-4 text-left font-medium">Descrição</th>
                    <th className="px-4 py-4 text-left font-medium">Status</th>
                    <th className="px-4 py-4 text-left font-medium">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-700/30 transition">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full 
                          ${transaction.type === 'deposit' ? 'bg-green-900/30 text-green-400' : 
                            transaction.type === 'withdrawal' ? 'bg-red-900/30 text-red-400' : 
                            transaction.type === 'bet' ? 'bg-yellow-900/30 text-yellow-400' : 
                            'bg-blue-900/30 text-blue-400'}`}>
                          {transaction.type === 'deposit' ? 'Depósito' : 
                           transaction.type === 'withdrawal' ? 'Saque' : 
                           transaction.type === 'bet' ? 'Aposta' : 'Ganho'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`font-bold ${
                          transaction.type === 'deposit' || transaction.type === 'win' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}
                          R$ {transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-300 text-sm">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-xs font-medium 
                          ${transaction.status === 'completed' ? 'text-green-500' : 
                            transaction.status === 'pending' ? 'text-yellow-500' : 
                            'text-red-500'}`}>
                          {transaction.status === 'completed' ? '● Concluído' : 
                           transaction.status === 'pending' ? '● Pendente' : '● Rejeitado'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-400 text-xs">
                        {new Date(transaction.created_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Limites de Jogo Responsável */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Settings className="mr-2 text-purple-400" size={20} />
            Limites de Jogo
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Limite de Depósito Diário</p>
              <p className="text-xl font-bold text-white">R$ {limites?.limite_deposito_diario.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Limite de Aposta Diária</p>
              <p className="text-xl font-bold text-white">R$ {limites?.limite_aposta_diaria.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs mb-1 uppercase font-bold">Tempo de Sessão Máximo</p>
              <p className="text-xl font-bold text-white">{limites?.tempo_sessao_maximo} minutos</p>
            </div>
            <button 
              className="w-full mt-4 text-gray-400 hover:text-white text-sm font-medium transition flex items-center justify-center"
              onClick={() => alert('Configurações de limites em breve.')}
            >
              Alterar Limites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
