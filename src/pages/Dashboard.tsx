import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useUserData from '../hooks/useUserData';
import { getUserTransactions, Transaction } from '../services/userService';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userTransactions = await getUserTransactions(currentUser.id);
        setTransactions(userTransactions);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">Dashboard</h1>
      
      {/* Seção de Saldo */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">Seu Saldo</h2>
        <p className="text-4xl font-bold text-white">
          R$ {userData?.balance.toFixed(2)}
        </p>
        <div className="mt-4 flex space-x-4">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            onClick={() => window.location.href = '/deposit'}
          >
            Depositar
          </button>
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            onClick={() => window.location.href = '/withdraw'}
          >
            Sacar
          </button>
        </div>
      </div>
      
      {/* Seção de Histórico */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Histórico de Transações</h2>
        
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhuma transação encontrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-800">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 
                          transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' : 
                          transaction.type === 'bet' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {transaction.type === 'deposit' ? 'Depósito' : 
                         transaction.type === 'withdrawal' ? 'Saque' : 
                         transaction.type === 'bet' ? 'Aposta' : 'Ganho'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`font-medium ${
                        transaction.type === 'deposit' || transaction.type === 'win' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}
                        R$ {transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {transaction.status === 'completed' ? 'Concluído' : 
                         transaction.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {transaction.createdAt.toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
