import React, { useState, useEffect } from 'react';

interface GameCardProps {
  id: number;
  name: string;
  odds: string;
  category: string;
  provider: string;
  isFavorite: boolean;
  onFavoriteToggle: (id: number) => void;
  onGameSelect: (id: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  odds,
  category,
  provider,
  isFavorite,
  onFavoriteToggle,
  onGameSelect
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Simular carregamento e animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 300 + (id * 100)); // Escalonar carregamento para efeito cascata
    
    const animTimer = setTimeout(() => {
      setAnimateIn(true);
    }, 500 + (id * 100));
    
    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
    };
  }, [id]);
  
  // Determinar imagem baseada no nome do jogo
  const getGameImage = () => {
    if (name.toLowerCase().includes('rabbit')) {
      return 'https://img.freepik.com/premium-vector/cartoon-rabbit-mascot_194935-124.jpg';
    } else if (name.toLowerCase().includes('tiger')) {
      return 'https://img.freepik.com/premium-vector/cartoon-tiger-mascot_194935-126.jpg';
    } else if (name.toLowerCase().includes('dragon')) {
      return 'https://img.freepik.com/premium-vector/cartoon-dragon-mascot_194935-128.jpg';
    } else if (name.toLowerCase().includes('ox')) {
      return 'https://img.freepik.com/premium-vector/cartoon-ox-mascot_194935-129.jpg';
    } else if (name.toLowerCase().includes('mouse')) {
      return 'https://img.freepik.com/premium-vector/cartoon-mouse-mascot_194935-130.jpg';
    } else if (name.toLowerCase().includes('fish')) {
      return 'https://img.freepik.com/premium-vector/cartoon-fish-mascot_194935-131.jpg';
    } else if (name.toLowerCase().includes('lion')) {
      return 'https://img.freepik.com/premium-vector/cartoon-lion-mascot_194935-132.jpg';
    } else if (name.toLowerCase().includes('crash')) {
      return 'https://img.freepik.com/premium-vector/cartoon-rocket-mascot_194935-133.jpg';
    } else {
      return 'https://img.freepik.com/premium-vector/cartoon-slot-machine-mascot_194935-134.jpg';
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(id);
  };
  
  return (
    <div 
      className={`game-card ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onGameSelect(id)}
      style={{ transform: isHovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)' }}
    >
      <div className="game-provider">
        {provider}
      </div>
      
      <button 
        className={`game-favorite ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={isFavorite ? "currentColor" : "none"} 
          stroke="currentColor" 
          className="w-5 h-5"
          style={{ 
            filter: isFavorite ? 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.7))' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={isFavorite ? 0 : 2} 
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
          />
        </svg>
      </button>
      
      <div className="game-image-container">
        {!imageLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <div className="animate-pulse text-primary text-xl font-bold">PG</div>
          </div>
        ) : (
          <img 
            src={getGameImage()} 
            alt={name} 
            className="game-image"
            style={{ 
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s ease'
            }}
          />
        )}
        
        <div 
          className="game-overlay"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <button className="btn-primary px-4 py-2 text-sm">
            Jogar Agora
          </button>
        </div>
      </div>
      
      <div className="game-name">
        {name}
        <div className="game-odds">{odds}</div>
      </div>
    </div>
  );
};

export default GameCard;
