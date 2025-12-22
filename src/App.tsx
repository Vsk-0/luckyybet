import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Dashboard from './pages/Dashboard';
import DepositPage from './pages/DepositPage'; // Importar a página de depósito
import AdminPage from './pages/AdminPage'; // Importar a página de administração
import WithdrawPage from './pages/WithdrawPage'; // Importar a página de saque
import FortuneTiger from './games/FortuneTiger'; // Importar o novo jogo
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Disclaimer } from './components/Disclaimer';
import AgeVerificationModal from './components/AgeVerificationModal';
import PromotionCarousel from './components/PromotionCarousel';
import ActivityFeed from './components/ActivityFeed';
import GameCategories from './components/GameCategories';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
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
    <>
      <AgeVerificationModal onVerified={() => setIsAgeVerified(true)} />
      {isAgeVerified && (
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
              <h1 className="text-4xl font-bold text-center mb-2 text-purple-500">Bem-vindo ao LuckyYBet</h1>
              <p className="text-xl text-center mb-8 text-gray-400">Plataforma de Simulação Educacional de Jogos</p>
              
              {/* Carrossel de Promoções */}
              <PromotionCarousel />
              
              {/* Layout com Grid: Categorias e Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Categorias de Jogos */}
                <div className="lg:col-span-2">
	                  <GameCategories onCategoryClick={(id) => console.log('Categoria:', id)} />
                </div>
                
                {/* Feed de Atividades */}
                <div className="lg:col-span-1">
                  <ActivityFeed />
                </div>
              </div>
              
              {/* Seção de Jogos Populares */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 text-white">🎮 Jogos Populares</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card de Jogo 1 */}
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                    <img 
                      src="https://via.placeholder.com/400x200/6b46c1/ffffff?text=Fortune+Tiger" 
                      alt="Fortune Tiger" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
	                      <h3 className="text-xl font-bold mb-2 text-purple-400">Fortune Tiger</h3>
	                      <p className="text-gray-400 mb-4 text-sm">O jogo mais popular! Teste sua sorte com o tigre da fortuna.</p>
	                      <button 
	                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
	                        onClick={() => navigate('/game/fortune-tiger')}
	                      >
	                        Jogar Agora
	                      </button>
                    </div>
                  </div>
                  
                  {/* Card de Jogo 2 */}
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                    <img 
                      src="https://via.placeholder.com/400x200/ef4444/ffffff?text=Aviator" 
                      alt="Aviator" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2 text-red-400">Aviator</h3>
                      <p className="text-gray-400 mb-4 text-sm">Decole e multiplique seus ganhos antes do avião desaparecer!</p>
                      <button 
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        onClick={() => currentUser ? null : setIsLoginModalOpen(true)}
                      >
                        Jogar Agora
                      </button>
                    </div>
                  </div>
                  
                  {/* Card de Jogo 3 */}
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                    <img 
                      src="https://via.placeholder.com/400x200/10b981/ffffff?text=Mines" 
                      alt="Mines" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2 text-green-400">Mines</h3>
                      <p className="text-gray-400 mb-4 text-sm">Desvie das minas e acumule prêmios incríveis!</p>
                      <button 
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        onClick={() => currentUser ? null : setIsLoginModalOpen(true)}
                      >
                        Jogar Agora
                      </button>
                    </div>
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
	          {/* Adicionar rota para o jogo Fortune Tiger */}
	          <Route 
	            path="/game/fortune-tiger" 
	            element={
	              <ProtectedRoute>
	                <FortuneTiger />
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
        onSuccess={() => {
          setIsRegisterModalOpen(false);
          navigate('/dashboard'); // Redireciona após KYC
        }}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
      )}
    </>
  );
}

export default App;
