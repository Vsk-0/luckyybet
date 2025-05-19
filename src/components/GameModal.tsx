import React, { useState, useEffect } from 'react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: number;
  gameName: string;
  gameProvider: string;
}

const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  gameId,
  gameName,
  gameProvider
}) => {
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'spinning' | 'result'>('loading');
  const [betAmount, setBetAmount] = useState(1);
  const [winAmount, setWinAmount] = useState(0);
  const [spinResult, setSpinResult] = useState<string[]>([]);
  const [isWin, setIsWin] = useState(false);
  
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
    setGameState('spinning');
    
    // Simular giro e resultado
    setTimeout(() => {
      const symbols = ['🐯', '🐰', '🐲', '🐂', '🐁', '🐠', '7️⃣', '💰'];
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
        setWinAmount(Math.round(betAmount * multiplier * 100) / 100);
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
  
  const increaseBet = () => {
    setBetAmount(prev => Math.min(prev + 1, 100));
  };
  
  const decreaseBet = () => {
    setBetAmount(prev => Math.max(prev - 1, 1));
  };
  
  const maxBet = () => {
    setBetAmount(100);
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
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-center mb-4">
                <span className="inline-block text-4xl font-bold text-primary animate-pulse">PG</span>
              </div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Carregando jogo...</p>
            </div>
          ) : (
            <div className="game-container">
              {/* Tela do jogo */}
              <div className="game-screen bg-black relative overflow-hidden" style={{height: '240px'}}>
                {gameState === 'ready' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white mb-2">Clique em GIRAR para começar</p>
                      <div className="flex justify-center">
                        <img 
                          src={`https://img.freepik.com/premium-vector/cartoon-${gameName.toLowerCase().includes('tiger') ? 'tiger' : 
                                 gameName.toLowerCase().includes('rabbit') ? 'rabbit' : 
                                 gameName.toLowerCase().includes('dragon') ? 'dragon' : 'animal'}-mascot.jpg`} 
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
                      <div className="animate-spin text-5xl">🎰</div>
                      <div className="animate-spin text-5xl" style={{animationDelay: '0.1s'}}>🎰</div>
                      <div className="animate-spin text-5xl" style={{animationDelay: '0.2s'}}>🎰</div>
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
                      <div className="text-center">
                        <div className="text-primary text-2xl font-bold animate-bounce">VOCÊ GANHOU!</div>
                        <div className="text-primary text-xl">R$ {winAmount.toFixed(2)}</div>
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
              <div className="game-controls p-4 bg-secondary border-t border-primary/20">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo</p>
                    <p className="text-primary font-bold">R$ 1000.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Último Ganho</p>
                    <p className={`font-bold ${isWin ? 'text-primary' : 'text-muted-foreground'}`}>
                      R$ {winAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <button 
                      onClick={decreaseBet}
                      className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-l"
                      disabled={gameState === 'spinning'}
                    >
                      -
                    </button>
                    <div className="bg-black/50 text-white px-4 py-1">
                      R$ {betAmount.toFixed(2)}
                    </div>
                    <button 
                      onClick={increaseBet}
                      className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-r"
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
                  className={`w-full py-3 rounded-lg font-bold text-black ${gameState === 'spinning' ? 'bg-gray-500' : 'bg-primary hover:bg-primary/90'} transition-colors`}
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
