import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Dashboard from './pages/Dashboard';
import DepositPage from './pages/DepositPage';
import AdminPage from './pages/AdminPage';
import WithdrawPage from './pages/WithdrawPage';
import FortuneTiger from './games/FortuneTiger';
import GenericSlot from './games/GenericSlot';
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
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
          <header className="bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <h1 className="text-2xl font-bold text-purple-500">LuckyYBet</h1>
              </div>
              <div>
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate('/dashboard')}
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

          <main>
            <Routes>
              <Route path="/" element={
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-4xl font-bold text-center mb-2 text-purple-500">Bem-vindo ao LuckyYBet</h1>
                  <p className="text-xl text-center mb-8 text-gray-400">Plataforma de Simulação Educacional de Jogos</p>
                  
                  <PromotionCarousel />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2">
                      <GameCategories onCategoryClick={(id) => console.log('Categoria:', id)} />
                    </div>
                    <div className="lg:col-span-1">
                      <ActivityFeed />
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-6 text-white">🎮 Jogos Populares</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Fortune Tiger */}
                      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                        <img src="https://via.placeholder.com/400x200/6b46c1/ffffff?text=Fortune+Tiger" alt="Fortune Tiger" className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2 text-purple-400">Fortune Tiger</h3>
                          <p className="text-gray-400 mb-4 text-sm">O jogo mais popular! Teste sua sorte com o tigre da fortuna.</p>
                          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={() => navigate('/game/fortune-tiger')}>Jogar Agora</button>
                        </div>
                      </div>
                      
                      {/* Lucky Neko */}
                      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                        <img src="https://via.placeholder.com/400x200/6b46c1/ffffff?text=Lucky+Neko" alt="Lucky Neko" className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2 text-purple-400">Lucky Neko</h3>
                          <p className="text-gray-400 mb-4 text-sm">O gato da sorte traz multiplicadores gigantes!</p>
                          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={() => navigate('/game/lucky-neko')}>Jogar Agora</button>
                        </div>
                      </div>

                      {/* Fortune Gems */}
                      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                        <img src="https://via.placeholder.com/400x200/f59e0b/ffffff?text=Fortune+Gems" alt="Fortune Gems" className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2 text-yellow-400">Fortune Gems</h3>
                          <p className="text-gray-400 mb-4 text-sm">Gemas preciosas e multiplicadores extras da TaDa Gaming.</p>
                          <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={() => navigate('/game/fortune-gems')}>Jogar Agora</button>
                        </div>
                      </div>

                      {/* Money Coming */}
                      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                        <img src="https://via.placeholder.com/400x200/10b981/ffffff?text=Money+Coming" alt="Money Coming" className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2 text-green-400">Money Coming</h3>
                          <p className="text-gray-400 mb-4 text-sm">Sinta a emoção de ganhar com a roda da fortuna!</p>
                          <button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={() => navigate('/game/money-coming')}>Jogar Agora</button>
                        </div>
                      </div>

                      {/* Aviator */}
                      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                        <img src="https://via.placeholder.com/400x200/ef4444/ffffff?text=Aviator" alt="Aviator" className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2 text-red-400">Aviator</h3>
                          <p className="text-gray-400 mb-4 text-sm">Decole e multiplique seus ganhos antes do avião sumir!</p>
                          <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={() => currentUser ? null : setIsLoginModalOpen(true)}>Jogar Agora</button>
                        </div>
                      </div>
                      
                      {/* Mines */}
                      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-700">
                        <img src="https://via.placeholder.com/400x200/10b981/ffffff?text=Mines" alt="Mines" className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2 text-green-400">Mines</h3>
                          <p className="text-gray-400 mb-4 text-sm">Desvie das minas e acumule prêmios incríveis!</p>
                          <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={() => currentUser ? null : setIsLoginModalOpen(true)}>Jogar Agora</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/game/fortune-tiger" element={<ProtectedRoute><FortuneTiger /></ProtectedRoute>} />
              <Route path="/game/lucky-neko" element={<ProtectedRoute><GenericSlot gameId="lucky-neko" gameName="Lucky Neko" provider="PG Soft" color="from-pink-600 to-purple-600" bannerUrl="https://via.placeholder.com/800x400/6b46c1/ffffff?text=Lucky+Neko" /></ProtectedRoute>} />
              <Route path="/game/fortune-gems" element={<ProtectedRoute><GenericSlot gameId="fortune-gems" gameName="Fortune Gems" provider="TaDa Gaming" color="from-yellow-500 to-orange-600" bannerUrl="https://via.placeholder.com/800x400/f59e0b/ffffff?text=Fortune+Gems" /></ProtectedRoute>} />
              <Route path="/game/money-coming" element={<ProtectedRoute><GenericSlot gameId="money-coming" gameName="Money Coming" provider="TaDa Gaming" color="from-green-500 to-emerald-700" bannerUrl="https://via.placeholder.com/800x400/10b981/ffffff?text=Money+Coming" /></ProtectedRoute>} />
              <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
              <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
            </Routes>
          </main>

          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSwitchToRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }} />
          <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSuccess={() => { setIsRegisterModalOpen(false); navigate('/dashboard'); }} onSwitchToLogin={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }} />
        </div>
      )}
    </>
  );
}

export default App;
