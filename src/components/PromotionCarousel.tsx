import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Promotion {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
  image?: string;
}

const promotions: Promotion[] = [
  {
    id: 1,
    title: 'Bônus de Boas-Vindas',
    subtitle: 'Ganhe R$ 100 de saldo inicial',
    gradient: 'from-purple-600 via-purple-700 to-pink-600',
  },
  {
    id: 2,
    title: 'Torneio Semanal',
    subtitle: 'Prêmios de até R$ 5.000',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Rodadas Grátis',
    subtitle: 'Jogue sem gastar seu saldo',
    gradient: 'from-green-500 via-teal-500 to-blue-500',
  },
  {
    id: 4,
    title: 'Cashback Diário',
    subtitle: 'Recupere parte das suas apostas',
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
  },
];

const PromotionCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-2xl mb-8">
      {/* Slides */}
      <div className="relative w-full h-full">
        {promotions.map((promo, index) => (
          <div
            key={promo.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${promo.gradient} flex items-center justify-center relative`}>
              {/* Conteúdo do Slide */}
              <div className="text-center z-10 px-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {promo.title}
                </h2>
                <p className="text-xl md:text-2xl lg:text-3xl text-white/90 drop-shadow-md">
                  {promo.subtitle}
                </p>
                <button className="mt-6 bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg">
                  Participar Agora
                </button>
              </div>

              {/* Efeito de Brilho */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {/* Selo de Jogo Responsável */}
              <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                <span className="text-white text-xs font-semibold">⚠️ Jogue com responsabilidade</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de Navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition duration-300 z-20 backdrop-blur-sm"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition duration-300 z-20 backdrop-blur-sm"
        aria-label="Próximo slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador de Slides */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold z-20">
        {currentSlide + 1} / {promotions.length}
      </div>
    </div>
  );
};

export default PromotionCarousel;
