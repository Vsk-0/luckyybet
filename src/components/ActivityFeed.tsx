import { useState, useEffect } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

interface Activity {
  id: number;
  type: 'bet' | 'win';
  user: string;
  game: string;
  amount: number;
  timestamp: Date;
}

// Simulação de atividades para demonstração
const generateMockActivities = (): Activity[] => {
  const games = ['Fortune Tiger', 'Aviator', 'Mines', 'Roleta', 'Blackjack', 'Crash'];
  const users = ['João***', 'Maria***', 'Pedro***', 'Ana***', 'Carlos***', 'Julia***'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    type: Math.random() > 0.7 ? 'win' : 'bet',
    user: users[Math.floor(Math.random() * users.length)],
    game: games[Math.floor(Math.random() * games.length)],
    amount: parseFloat((Math.random() * 500 + 10).toFixed(2)),
    timestamp: new Date(Date.now() - Math.random() * 3600000),
  }));
};

const ActivityFeed = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'wins'>('recent');
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Gerar atividades iniciais
    setActivities(generateMockActivities());

    // Adicionar nova atividade a cada 5 segundos
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Date.now(),
        type: Math.random() > 0.7 ? 'win' : 'bet',
        user: ['João***', 'Maria***', 'Pedro***'][Math.floor(Math.random() * 3)],
        game: ['Fortune Tiger', 'Aviator', 'Mines'][Math.floor(Math.random() * 3)],
        amount: parseFloat((Math.random() * 500 + 10).toFixed(2)),
        timestamp: new Date(),
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activeTab === 'wins' 
    ? activities.filter(a => a.type === 'win')
    : activities;

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'agora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
    return `${Math.floor(seconds / 3600)}h atrás`;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
      {/* Tabs */}
      <div className="flex space-x-2 mb-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-2 px-4 font-semibold rounded-t-lg transition duration-300 ${
            activeTab === 'recent'
              ? 'bg-cyan-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Últimas Apostas
        </button>
        <button
          onClick={() => setActiveTab('wins')}
          className={`flex-1 py-2 px-4 font-semibold rounded-t-lg transition duration-300 ${
            activeTab === 'wins'
              ? 'bg-cyan-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Grandes Ganhos
        </button>
      </div>

      {/* Feed de Atividades */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-3">
              <Trophy className="text-gray-500" size={32} />
            </div>
            <p className="text-gray-400">Nenhum resultado encontrado.</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-gray-900 rounded-lg p-3 hover:bg-gray-700 transition duration-300 border border-gray-700 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'win' 
                      ? 'bg-green-500/20' 
                      : 'bg-blue-500/20'
                  }`}>
                    {activity.type === 'win' ? (
                      <Trophy className="text-green-400" size={20} />
                    ) : (
                      <TrendingUp className="text-blue-400" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {activity.user}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {activity.game}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    activity.type === 'win' ? 'text-green-400' : 'text-cyan-400'
                  }`}>
                    R$ {activity.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rodapé */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500">
          🎮 Atividades simuladas para fins educacionais
        </p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;
