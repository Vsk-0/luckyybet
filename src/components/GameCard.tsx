import React from 'react';

interface GameCardProps {
  id: number;
  name: string;
  odds: string;
  category: string;
  provider: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: number) => void;
  onGameSelect?: (id: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  odds,
  category,
  provider,
  isFavorite = false,
  onFavoriteToggle,
  onGameSelect
}) => {
  // Função para determinar a imagem com base no nome do jogo
  const getGameImage = () => {
    if (name.includes('Fortune Rabbit')) {
      return "https://img.freepik.com/premium-vector/cute-rabbit-mascot-cartoon-vector-icon-illustration_480044-334.jpg";
    } else if (name.includes('Fortune Tiger')) {
      return "https://img.freepik.com/premium-vector/cartoon-tiger-mascot_194935-126.jpg";
    } else if (name.includes('Fortune Dragon')) {
      return "https://img.freepik.com/premium-vector/cute-dragon-mascot-cartoon-vector-icon-illustration_480044-333.jpg";
    } else if (name.includes('Fortune Ox')) {
      return "https://img.freepik.com/premium-vector/cute-ox-mascot-cartoon-vector-icon-illustration_480044-332.jpg";
    } else if (name.includes('Fortune Mouse')) {
      return "https://img.freepik.com/premium-vector/cute-mouse-mascot-cartoon-vector-icon-illustration_480044-331.jpg";
    } else if (name.includes('Fortune Fish')) {
      return "https://img.freepik.com/premium-vector/cute-fish-mascot-cartoon-vector-icon-illustration_480044-330.jpg";
    } else if (name.includes('Fortune Lion')) {
      return "https://img.freepik.com/premium-vector/cute-lion-mascot-cartoon-vector-icon-illustration_480044-329.jpg";
    } else if (name.includes('Crash')) {
      return "https://img.freepik.com/premium-vector/crash-game-icon-vector-illustration_514344-292.jpg";
    } else if (name.includes('Bingo')) {
      return "https://img.freepik.com/premium-vector/bingo-lottery-balls-with-numbers-vector-illustration_514344-293.jpg";
    }
    
    // Fallback para jogos sem imagem específica
    return "";
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  const handleCardClick = () => {
    if (onGameSelect) {
      onGameSelect(id);
    }
  };

  const gameImage = getGameImage();

  return (
    <div className="game-card" onClick={handleCardClick}>
      <div className="relative bg-secondary rounded-lg overflow-hidden">
        <div className="game-provider-badge">
          <span>{provider}</span>
        </div>
        
        <button 
          className="favorite-button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove dos favoritos" : "Adicionar aos favoritos"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isFavorite ? "0" : "1.5"}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
        
        {/* Imagem do jogo */}
        <div className="aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
          {gameImage ? (
            <img 
              src={gameImage} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl">
              {category === 'slots' ? '🎰' : 
               category === 'crash' ? '📈' : 
               category === 'bingo' ? '🎯' : '🎮'}
            </div>
          )}
        </div>
        
        {/* Overlay ao passar o mouse */}
        <div className="game-card-overlay">
          <button className="game-card-button">Jogar Agora</button>
        </div>
        
        {/* Nome do jogo */}
        <div className="p-2 text-center">
          <h3 className="text-sm font-medium">{name}</h3>
          <p className="text-xs text-primary">{odds}</p>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
