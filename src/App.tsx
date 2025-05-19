import { useState } from 'react'
import './App.css'
import logo from './assets/images/logo.png'
import banner from './assets/images/banner.png'

function App() {
  const [activeTab, setActiveTab] = useState('popular')
  
  const games = [
    { id: 1, name: 'Futebol Brasileiro', odds: '1.95', category: 'esportes' },
    { id: 2, name: 'Roleta Premium', odds: '2.5x', category: 'cassino' },
    { id: 3, name: 'Blackjack VIP', odds: '3.0x', category: 'cassino' },
    { id: 4, name: 'Champions League', odds: '2.10', category: 'esportes' },
    { id: 5, name: 'Slots Fortune', odds: '5.0x', category: 'slots' },
    { id: 6, name: 'Poker Texas', odds: '4.0x', category: 'poker' },
    { id: 7, name: 'NBA Ao Vivo', odds: '1.85', category: 'esportes' },
    { id: 8, name: 'Crash Game', odds: '10.0x', category: 'crash' },
    { id: 9, name: 'Bingo Royal', odds: '3.5x', category: 'bingo' },
  ]

  const filteredGames = activeTab === 'popular' 
    ? games 
    : games.filter(game => game.category === activeTab)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-secondary py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Luckyybet" className="h-12" />
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="nav-link active">Início</a>
            <a href="#" className="nav-link">Esportes</a>
            <a href="#" className="nav-link">Cassino</a>
            <a href="#" className="nav-link">Promoções</a>
            <a href="#" className="nav-link">Suporte</a>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
              Entrar
            </button>
            <button className="cta-button">
              Cadastrar
            </button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="container mx-auto px-4 py-6">
        <img src={banner} alt="Luckyybet - Aposte e Ganhe" className="w-full rounded-lg shadow-lg" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* CTA Section */}
        <section className="bg-secondary rounded-lg p-6 mb-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Comece a Apostar Agora!</h2>
          <p className="text-muted-foreground mb-6">Cadastre-se hoje e receba um bônus de 100% no seu primeiro depósito</p>
          <button className="cta-button text-lg px-8 py-4">
            Criar Conta Grátis
          </button>
          <div className="mt-4 text-sm text-muted-foreground">
            Ou entre em contato pelo <a href="#" className="text-primary underline">WhatsApp</a>
          </div>
        </section>

        {/* Games Section */}
        <section className="mb-10">
          <h2 className="section-title">Jogos Disponíveis</h2>
          
          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-4 mb-6 pb-2">
            <button 
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'popular' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              Popular
            </button>
            <button 
              onClick={() => setActiveTab('esportes')}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'esportes' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              Esportes
            </button>
            <button 
              onClick={() => setActiveTab('cassino')}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'cassino' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              Cassino
            </button>
            <button 
              onClick={() => setActiveTab('slots')}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'slots' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              Slots
            </button>
            <button 
              onClick={() => setActiveTab('crash')}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${activeTab === 'crash' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              Crash
            </button>
          </div>
          
          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredGames.map(game => (
              <div key={game.id} className="bg-secondary rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">{game.name}</h3>
                  <span className="text-primary font-medium">{game.odds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground capitalize">{game.category}</span>
                  <button className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded text-sm">
                    Apostar
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 rounded-md transition-colors">
              Carregar mais
            </button>
          </div>
        </section>
        
        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-secondary p-6 rounded-lg text-center">
            <div className="text-primary text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-xl mb-2">100% Seguro</h3>
            <p className="text-muted-foreground">Transações protegidas e dados criptografados</p>
          </div>
          <div className="bg-secondary p-6 rounded-lg text-center">
            <div className="text-primary text-4xl mb-4">💰</div>
            <h3 className="font-bold text-xl mb-2">Pagamento Rápido</h3>
            <p className="text-muted-foreground">Saques processados em até 24 horas</p>
          </div>
          <div className="bg-secondary p-6 rounded-lg text-center">
            <div className="text-primary text-4xl mb-4">🎮</div>
            <h3 className="font-bold text-xl mb-2">Jogos Premium</h3>
            <p className="text-muted-foreground">Os melhores jogos e odds do mercado</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <img src={logo} alt="Luckyybet" className="h-10 mb-4" />
              <p className="text-muted-foreground max-w-xs">A melhor plataforma de apostas online do Brasil. Aposte com segurança e ganhe!</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Início</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Esportes</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Cassino</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Promoções</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Suporte</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">FAQ</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Contato</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">WhatsApp</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Chat ao Vivo</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Termos de Uso</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Privacidade</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Jogo Responsável</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Licença</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Luckyybet. Todos os direitos reservados.</p>
            <p className="text-sm mt-2">Proibido para menores de 18 anos. Jogue com responsabilidade.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
