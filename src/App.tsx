import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Dashboard from './pages/Dashboard';
import DepositPage from './pages/DepositPage'; // Importar a página de depósito
import AdminPage from './pages/AdminPage'; // Importar a página de administração
import WithdrawPage from './pages/WithdrawPage'; // Importar a página de saque
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Disclaimer } from './components/Disclaimer';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate(); // Usar useNavigate para navegação programática

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirecionar para a home após logout
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Disclaimer />
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold text-purple-500">LuckyYBet</h1>
          </div>
          <div>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')} // Usar navigate
                  className="text-white hover:text-purple-300 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-transparent hover:bg-purple-700 text-purple-500 hover:text-white border border-purple-500 hover:border-transparent px-4 py-2 rounded transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                >
                  Registrar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold text-center mb-8 text-purple-500">Bem-vindo ao LuckyYBet</h1>
              <p className="text-xl text-center mb-8">O melhor site de apostas simuladas!</p>
              
              {/* Seção de jogos aqui */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Exemplo de card de jogo */}
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                  <img 
                    src="https://via.placeholder.com/400x200" 
                    alt="Fortune Tiger" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-purple-400">Fortune Tiger</h3>
                    <p className="text-gray-400 mb-4">Jogue o famoso Fortune Tiger e teste sua sorte!</p>
                    <button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition"
                      onClick={() => currentUser ? null : setIsLoginModalOpen(true)} // Ajustar lógica de jogo depois
                    >
                      Jogar Agora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Adicionar rota para a página de depósito */}
          <Route 
            path="/deposit" 
            element={
              <ProtectedRoute>
                <DepositPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/withdraw" 
            element={
              <ProtectedRoute>
                <WithdrawPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}> {/* Add adminOnly prop */}
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
}

export default App;
