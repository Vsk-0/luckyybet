import { Dices, Sparkles, Video, Trophy, Gamepad2 } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'slots',
    title: 'SLOTS',
    icon: <Sparkles size={48} />,
    gradient: 'from-purple-500 via-purple-600 to-pink-500',
    description: 'Caça-níqueis e jogos de sorte',
  },
  {
    id: 'casino',
    title: 'CASSINO',
    icon: <Dices size={48} />,
    gradient: 'from-blue-500 via-blue-600 to-cyan-500',
    description: 'Roleta, Blackjack e mais',
  },
  {
    id: 'live',
    title: 'AO VIVO',
    icon: <Video size={48} />,
    gradient: 'from-red-500 via-pink-500 to-rose-500',
    description: 'Dealers reais em tempo real',
  },
  {
    id: 'tournaments',
    title: 'TORNEIOS',
    icon: <Trophy size={48} />,
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
    description: 'Competições e prêmios',
  },
  {
    id: 'games',
    title: 'JOGOS',
    icon: <Gamepad2 size={48} />,
    gradient: 'from-green-500 via-teal-500 to-emerald-500',
    description: 'Crash, Mines, Aviator e mais',
  },
];

interface GameCategoriesProps {
  onCategoryClick?: (categoryId: string) => void;
}

const GameCategories = ({ onCategoryClick }: GameCategoriesProps) => {
  const handleClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
        <Sparkles className="mr-3 text-purple-500" size={32} />
        Categorias em Destaque
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleClick(category.id)}
            className="group relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            {/* Fundo com Gradiente */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Efeito de Brilho no Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Conteúdo */}
            <div className="relative p-6 flex flex-col items-center justify-center h-48">
              {/* Ícone */}
              <div className="text-white mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              
              {/* Título */}
              <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                {category.title}
              </h3>
              
              {/* Descrição */}
              <p className="text-white/80 text-sm text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {category.description}
              </p>
            </div>

            {/* Borda Animada */}
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-xl transition-all duration-300"></div>
          </button>
        ))}
      </div>

      {/* Nota Educacional */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          🎓 Todos os jogos são simulados para fins educacionais - Não envolve dinheiro real
        </p>
      </div>
    </div>
  );
};

export default GameCategories;
