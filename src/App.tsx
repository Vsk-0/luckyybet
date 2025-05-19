import { useState, useEffect } from 'react'
import './App.css'
import logo from './assets/images/logo.png'
import banner from './assets/images/banner.png'
import GameCard from './components/GameCard'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import PromotionsSection from './components/PromotionsSection'

function App() {
  const [activeTab, setActiveTab] = useState('popular')
  const [jackpotValue, setJackpotValue] = useState('21.405.482,19')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [showPromotions, setShowPromotions] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<number | null>(null)
  
  // Simular incremento do jackpot
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotValue(prev => {
        const currentValue = parseFloat(prev.replace(/\./g, '').replace(',', '.'))
        const newValue = currentValue + Math.random() * 10
        return newValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).replace(',00', ',19')
      })
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  const games = [
    { id: 1, name: 'Fortune Rabbit', odds: '1.95', category: 'popular', provider: 'PG' },
    { id: 2, name: 'Fortune Tiger', odds: '2.5x', category: 'popular', provider: 'PG' },
    { id: 3, name: 'Fortune Dragon', odds: '3.0x', category: 'popular', provider: 'PG' },
    { id: 4, name: 'Fortune Ox', odds: '2.10', category: 'popular', provider: 'PG' },
    { id: 5, name: 'Fortune Mouse', odds: '5.0x', category: 'slots', provider: 'PG' },
    { id: 6, name: 'Fortune Fish', odds: '4.0x', category: 'slots', provider: 'PG' },
    { id: 7, name: 'Fortune Lion', odds: '1.85', category: 'slots', provider: 'PG' },
    { id: 8, name: 'Crash Game', odds: '10.0x', category: 'crash', provider: 'WG' },
    { id: 9, name: 'Bingo Royal', odds: '3.5x', category: 'bingo', provider: 'CP' },
  ]

  const filteredGames = activeTab === 'popular' 
    ? games.filter(game => game.category === 'popular')
    : games.filter(game => game.category === activeTab)

  const handleLogin = (username: string, _password: string) => {
    // Simulação de login bem-sucedido
    setIsLoggedIn(true)
    setUsername(username)
    setIsLoginModalOpen(false)
  }

  const handleRegister = (formData: any) => {
    // Simulação de registro bem-sucedido
    setIsLoggedIn(true)
    setUsername(formData.username)
    setIsRegisterModalOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
  }

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const handleGameSelect = (id: number) => {
    setSelectedGame(id)
    setIsGameModalOpen(true)
  }

  const togglePromotions = () => {
    setShowPromotions(!showPromotions)
  }

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="site-header">
        <div className="container mx-auto flex justify-between items-center">
          <div className="logo-container">
            <img src={logo} alt="Luckyybet" className="logo" />
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <span className="bg-green-600 rounded-full p-1 mr-2">
                <img src="https://flagcdn.com/br.svg" alt="BR" className="h-4 w-6" />
              </span>
              <span className="gold-text font-bold">10,14</span>
            </div>
            {isLoggedIn ? (
              <div className="flex items-center">
                <span className="mr-2 text-sm">{username}</span>
                <button 
                  onClick={handleLogout}
                  className="btn-outline"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={openLoginModal}
                  className="btn-outline"
                >
                  Entrar
                </button>
                <button className="btn-primary">
                  Depósito
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Banner de download do app */}
      <div className="app-banner">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-xs gold-text font-bold mr-2">LUCKYYBET.COM</div>
            <div className="text-xs text-white">APP PARA OBTER R$18</div>
            <div className="ml-2 hot-tag">HOT</div>
          </div>
          <button className="btn-secondary text-xs">
            Baixar Agora
          </button>
        </div>
      </div>

      {/* Conteúdo principal */}
      {showPromotions ? (
        <PromotionsSection />
      ) : (
        <>
          {/* Banner */}
          <div className="container mx-auto px-4 py-6">
            <img src={banner} alt="Luckyybet - Aposte e Ganhe" className="w-full rounded-lg shadow-lg" />
          </div>

          {/* Jackpot */}
          <div className="container mx-auto px-4 mb-6">
            <div className="jackpot-container">
              <div className="flex justify-between items-center">
                <img 
                  src="https://img.freepik.com/premium-vector/cartoon-tiger-mascot_194935-126.jpg" 
                  alt="Tiger" 
                  className="h-24 -ml-2 floating"
                />
                <div className="text-center">
                  <div className="jackpot-title jackpot-wings">
                    JACKPOT
                  </div>
                  <div className="jackpot-value jackpot-animation">{jackpotValue}</div>
                </div>
                <img 
                  src="https://img.freepik.com/premium-vector/cartoon-businessman-pig-mascot_194935-127.jpg" 
                  alt="Businessman" 
                  className="h-24 -mr-2 floating"
                />
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div className="container mx-auto px-4 mb-4">
            <div className="categories-container">
              <button 
                onClick={() => setActiveTab('popular')}
                className={`category-button ${activeTab === 'popular' ? 'active' : ''}`}
              >
                <span className="category-icon">🔥</span>
                <span className="text-sm">Popular</span>
              </button>
              <button 
                onClick={() => setActiveTab('slots')}
                className={`category-button ${activeTab === 'slots' ? 'active' : ''}`}
              >
                <span className="category-icon">🎰</span>
                <span className="text-sm">Slots</span>
              </button>
              <button 
                onClick={() => setActiveTab('blockchain')}
                className={`category-button ${activeTab === 'blockchain' ? 'active' : ''}`}
              >
                <span className="category-icon">⛓️</span>
                <span className="text-sm">Blockchain</span>
              </button>
              <button 
                onClick={() => setActiveTab('pescaria')}
                className={`category-button ${activeTab === 'pescaria' ? 'active' : ''}`}
              >
                <span className="category-icon">🐟</span>
                <span className="text-sm">Pescaria</span>
              </button>
              <button 
                onClick={() => setActiveTab('crash')}
                className={`category-button ${activeTab === 'crash' ? 'active' : ''}`}
              >
                <span className="category-icon">📈</span>
                <span className="text-sm">Crash</span>
              </button>
            </div>
          </div>

          {/* Linha divisória */}
          <div className="container mx-auto px-4 mb-6">
            <div className="border-t border-border"></div>
          </div>

          {/* Main Content */}
          <main className="container mx-auto px-4 pb-24">
            {/* Título da seção */}
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-2">
                {activeTab === 'popular' ? '🔥' : 
                activeTab === 'slots' ? '🎰' : 
                activeTab === 'blockchain' ? '⛓️' : 
                activeTab === 'pescaria' ? '🐟' : '📈'}
              </span>
              <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
            </div>
            
            {/* Games Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8 game-grid">
              {filteredGames.length > 0 ? (
                filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    odds={game.odds}
                    category={game.category}
                    provider={game.provider}
                    isFavorite={favorites.includes(game.id)}
                    onFavoriteToggle={toggleFavorite}
                    onGameSelect={handleGameSelect}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-muted-foreground">
                  Nenhum jogo encontrado nesta categoria.
                </div>
              )}
            </div>
            
            {/* Convite para amigos */}
            <div className="promotion-card shine-effect">
              <div className="promotion-content">
                <div className="text-xl mb-2 gold-text">👥 Convide Amigos para jogar juntos</div>
                <p className="promotion-description mb-4">Ganhe até R$30 por cada amigo indicado</p>
                <button className="btn-primary w-full">
                  Convidar Agora
                </button>
              </div>
            </div>
          </main>
        </>
      )}

      {/* Footer Navigation */}
      <div className="bottom-nav">
        <button className="nav-item active">
          <span className="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
          <span className="nav-text">Começar</span>
        </button>
        
        <button 
          className="nav-item relative"
          onClick={togglePromotions}
        >
          <span className="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </span>
          <span className="nav-text">Promoção</span>
          <span className="notification-badge">
            1
          </span>
        </button>
        
        <button className="nav-item">
          <span className="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <span className="nav-text">Agente</span>
        </button>
        
        <button className="nav-item">
          <span className="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
          <span className="nav-text">Suporte</span>
        </button>
        
        <button 
          className="nav-item"
          onClick={() => !isLoggedIn && openLoginModal()}
        >
          <span className="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="nav-text">Perfil</span>
        </button>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegisterClick={openRegisterModal}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
        onLoginClick={openLoginModal}
      />

      {/* Game Modal - Será implementado na próxima etapa */}
      {isGameModalOpen && selectedGame && (
        <div className="modal-overlay" onClick={() => setIsGameModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {games.find(g => g.id === selectedGame)?.name}
              </h3>
              <button className="modal-close" onClick={() => setIsGameModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="text-center text-muted-foreground mb-4">
                Implementação do jogo em andamento...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
