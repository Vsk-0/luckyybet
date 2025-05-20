import React, { useState, useEffect } from 'react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
  gameProvider: string;
}

const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  gameName,
  gameProvider
}) => {
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'spinning' | 'result'>('loading');
  const [betAmount, setBetAmount] = useState(1);
  const [winAmount, setWinAmount] = useState(0);
  const [spinResult, setSpinResult] = useState<string[]>([]);
  const [isWin, setIsWin] = useState(false);
  const [balance, setBalance] = useState(1000);
  
  // Simular carregamento do jogo
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setGameState('loading');
      
      const timer = setTimeout(() => {
        setLoading(false);
        setGameState('ready');
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const handleSpin = () => {
    if (balance < betAmount) {
      alert('Saldo insuficiente para apostar');
      return;
    }
    
    // Deduzir aposta do saldo
    setBalance(prev => prev - betAmount);
    setGameState('spinning');
    
    // Simular giro e resultado
    setTimeout(() => {
      const symbols = getGameSymbols();
      const result = Array(3).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      
      // Simular vitória ocasional (1 em 3 chance)
      const win = Math.random() < 0.33;
      
      if (win) {
        // Forçar símbolos iguais para vitória
        const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        result[0] = winSymbol;
        result[1] = winSymbol;
        result[2] = winSymbol;
        
        // Calcular valor ganho (entre 1.5x e 10x a aposta)
        const multiplier = 1.5 + Math.random() * 8.5;
        const winValue = Math.round(betAmount * multiplier * 100) / 100;
        setWinAmount(winValue);
        setBalance(prev => prev + winValue);
        setIsWin(true);
      } else {
        setWinAmount(0);
        setIsWin(false);
      }
      
      setSpinResult(result);
      setGameState('result');
      
      // Retornar ao estado pronto após exibir o resultado
      setTimeout(() => {
        setGameState('ready');
      }, 3000);
    }, 2000);
  };
  
  const getGameSymbols = () => {
    // Retornar símbolos específicos baseados no nome do jogo
    if (gameName.toLowerCase().includes('tiger')) {
      return ['🐯', '💰', '🧧', '🏮', '🎋', '🎍', '7️⃣', '🎲'];
    } else if (gameName.toLowerCase().includes('rabbit')) {
      return ['🐰', '🥕', '🌙', '🌟', '🎭', '🎪', '7️⃣', '🎲'];
    } else if (gameName.toLowerCase().includes('dragon')) {
      return ['🐲', '🔥', '💎', '🏆', '👑', '🧿', '7️⃣', '🎲'];
    } else if (gameName.toLowerCase().includes('ox')) {
      return ['🐂', '🌾', '🌿', '🍀', '🧧', '🎋', '7️⃣', '🎲'];
    } else if (gameName.toLowerCase().includes('ganesha')) {
      return ['🐘', '🕉️', '💐', '🪔', '🧿', '🎭', '7️⃣', '🎲'];
    } else if (gameName.toLowerCase().includes('bonanza')) {
      return ['🍬', '🍭', '🍫', '🧁', '🍪', '🎂', '7️⃣', '🎲'];
    } else {
      return ['💰', '💎', '🎲', '🎰', '7️⃣', '👑', '🏆', '💵'];
    }
  };
  
  const increaseBet = () => {
    setBetAmount(prev => Math.min(prev + 1, 100));
  };
  
  const decreaseBet = () => {
    setBetAmount(prev => Math.max(prev - 1, 1));
  };
  
  const maxBet = () => {
    setBetAmount(Math.min(100, balance));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="modal-header bg-primary/10 flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold mr-2">
              {gameProvider}
            </span>
            <h2 className="modal-title">{gameName}</h2>
          </div>
          <button 
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>
        </div>
        
        <div className="p-0">
          {loading ? (
            <div className="pg-game-loading">
              <div className="pg-game-logo">PG</div>
              <div className="pg-game-spinner"></div>
              <p className="mt-4 text-muted-foreground">Carregando jogo...</p>
            </div>
          ) : (
            <div className="pg-game-container">
              {/* Tela do jogo */}
              <div className="pg-game-screen">
                {gameState === 'ready' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white mb-2">Clique em GIRAR para começar</p>
                      <div className="flex justify-center">
                        <img 
                          src={`https://img.freepik.com/premium-vector/cartoon-${gameName.toLowerCase().includes('tiger') ? 'tiger' : 
                                 gameName.toLowerCase().includes('rabbit') ? 'rabbit' : 
                                 gameName.toLowerCase().includes('dragon') ? 'dragon' : 
                                 gameName.toLowerCase().includes('ox') ? 'ox' :
                                 gameName.toLowerCase().includes('ganesha') ? 'elephant-god-ganesha' :
                                 gameName.toLowerCase().includes('bonanza') ? 'candy-slot' : 'slot-machine'}-mascot.jpg`} 
                          alt={gameName}
                          className="h-24 w-24 object-cover rounded-full border-2 border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {gameState === 'spinning' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-4">
                      <div className="slot-reel">
                        <div className="slot-symbol animate-spin" style={{animationDuration: '0.5s'}}>🎰</div>
                      </div>
                      <div className="slot-reel">
                        <div className="slot-symbol animate-spin" style={{animationDuration: '0.7s'}}>🎰</div>
                      </div>
                      <div className="slot-reel">
                        <div className="slot-symbol animate-spin" style={{animationDuration: '0.9s'}}>🎰</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {gameState === 'result' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex space-x-4 mb-4">
                      {spinResult.map((symbol, index) => (
                        <div key={index} className="text-5xl bg-secondary p-2 rounded-lg">{symbol}</div>
                      ))}
                    </div>
                    
                    {isWin ? (
                      <div className="slot-win">
                        <div className="slot-win-text">VOCÊ GANHOU!</div>
                        <div className="slot-win-amount">R$ {winAmount.toFixed(2)}</div>
                        <div className="particles-container">
                          {Array(20).fill(0).map((_, i) => (
                            <div 
                              key={i}
                              className="particle"
                              style={{
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 10 + 5}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${Math.random() * 3 + 2}s linear infinite`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-red-500 text-xl">Tente novamente</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Controles do jogo */}
              <div className="pg-game-controls">
                <div className="pg-game-balance">
                  <div>
                    <p className="pg-game-balance-label">Saldo</p>
                    <p className="pg-game-balance-value">R$ {balance.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="pg-game-balance-label">Último Ganho</p>
                    <p className={`font-bold ${isWin ? 'text-primary' : 'text-muted-foreground'}`}>
                      R$ {winAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="pg-game-bet-controls">
                  <div className="flex items-center">
                    <button 
                      onClick={decreaseBet}
                      className="pg-game-bet-button"
                      disabled={gameState === 'spinning'}
                    >
                      -
                    </button>
                    <div className="pg-game-bet-value">
                      R$ {betAmount.toFixed(2)}
                    </div>
                    <button 
                      onClick={increaseBet}
                      className="pg-game-bet-button"
                      disabled={gameState === 'spinning'}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={maxBet}
                    className="bg-black text-white px-3 py-1 rounded text-sm"
                    disabled={gameState === 'spinning'}
                  >
                    MAX
                  </button>
                </div>
                
                <button 
                  onClick={handleSpin}
                  disabled={gameState === 'spinning'}
                  className={`pg-game-spin-button ${gameState === 'spinning' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {gameState === 'spinning' ? 'GIRANDO...' : 'GIRAR'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;
