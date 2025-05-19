import React, { useState } from 'react';

interface PromotionCardProps {
  title: string;
  description: string;
  image?: string;
  buttonText: string;
  onClick: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  title,
  description,
  image,
  buttonText,
  onClick
}) => {
  return (
    <div className="promotion-card mb-4">
      {image && (
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <button 
          onClick={onClick}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium w-full transition-all duration-200 hover:bg-primary/90"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const PromotionsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('eventos');
  
  const promotions = [
    {
      id: 1,
      title: "Bônus de Primeiro Depósito",
      description: "Receba até R$3.777 no seu primeiro depósito",
      image: "https://img.freepik.com/premium-vector/gold-coins-cash-money-explosion-jackpot-casino-win_53562-15702.jpg",
      buttonText: "Depositar Agora",
      category: "eventos"
    },
    {
      id: 2,
      title: "Convide e Ganhe",
      description: "Ganhe até R$30 por cada amigo indicado",
      image: "https://img.freepik.com/premium-vector/refer-friend-concept-affiliate-marketing-loyalty-program-promotion-method_100456-9734.jpg",
      buttonText: "Convidar Amigos",
      category: "eventos"
    },
    {
      id: 3,
      title: "Recompensa Diária",
      description: "Faça login todos os dias e ganhe recompensas",
      image: "https://img.freepik.com/premium-vector/daily-reward-concept-gift-box-calendar-page-bonus-prize-loyalty-program_100456-1059.jpg",
      buttonText: "Receber",
      category: "recompensas"
    },
    {
      id: 4,
      title: "Cashback Semanal",
      description: "Recupere até 1% das suas apostas toda semana",
      image: "https://img.freepik.com/premium-vector/cashback-service-money-refund-cash-back-coins-wallet-bonus-program-concept_100456-1362.jpg",
      buttonText: "Ver Detalhes",
      category: "rebate"
    },
    {
      id: 5,
      title: "Programa VIP",
      description: "Benefícios exclusivos para jogadores VIP",
      image: "https://img.freepik.com/premium-vector/vip-club-members-only-golden-badge_100456-4016.jpg",
      buttonText: "Saiba Mais",
      category: "vip"
    }
  ];
  
  const filteredPromotions = promotions.filter(promo => promo.category === activeTab);
  
  const handlePromoClick = (id: number) => {
    console.log(`Promoção ${id} clicada`);
    // Implementar lógica de navegação ou ação específica
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Abas de navegação */}
      <div className="flex overflow-x-auto space-x-1 mb-6 pb-2 border-b border-border">
        <button 
          onClick={() => setActiveTab('eventos')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'eventos' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          Eventos
        </button>
        <button 
          onClick={() => setActiveTab('vip')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'vip' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          VIP
        </button>
        <button 
          onClick={() => setActiveTab('rebate')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'rebate' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          Taxa de Rebate
          <span className="ml-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center">
            1
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('recompensas')}
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'recompensas' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          Recompensas
        </button>
      </div>
      
      {/* Lista de promoções */}
      <div>
        {filteredPromotions.length > 0 ? (
          filteredPromotions.map(promo => (
            <PromotionCard
              key={promo.id}
              title={promo.title}
              description={promo.description}
              image={promo.image}
              buttonText={promo.buttonText}
              onClick={() => handlePromoClick(promo.id)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Nenhuma promoção disponível nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsSection;
