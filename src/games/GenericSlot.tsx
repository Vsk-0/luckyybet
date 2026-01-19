import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { updateUserBalance, addTransaction } from '../services/userService';
import { verificarLimiteAposta } from '../services/responsibleGaming';
import { ArrowLeft, Play, Info, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GenericSlotProps {
  gameId: string;
  gameName: string;
  provider: string;
  color: string;
  bannerUrl: string;
}

const GenericSlot: React.FC<GenericSlotProps> = ({ gameId, gameName, provider, color, bannerUrl }) => {
  const { currentUser } = useAuth();
  const { userData } = useUserData();
  const navigate = useNavigate();
  const [bet, setBet] = useState(1.00);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSpin = async () => {
    if (!currentUser || !userData) return;
    if (isSpinning) return;
    if (userData.balance < bet) {
      setError('Saldo insuficiente');
      return;
    }

    // Verificar limite de jogo responsável
    const limitePermitido = await verificarLimiteAposta(currentUser.id, bet);
    if (!limitePermitido) {
      setError('Limite de aposta diária atingido. Jogue com responsabilidade.');
      return;
    }

    setError(null);
    setIsSpinning(true);
    setResult(null);

    try {
      // Deduzir aposta
      const newBalanceAfterBet = userData.balance - bet;
      await updateUserBalance(currentUser.id, newBalanceAfterBet);
      await addTransaction({
        user_id: currentUser.id,
        type: 'bet',
        amount: bet,
        description: `Aposta no jogo ${gameName} (${provider})`,
        status: 'completed'
      });

      // Simular delay do giro
      setTimeout(async () => {
        const winChance = Math.random();
        let win = 0;
        let resMsg = 'Tente novamente!';

        if (winChance > 0.7) { // 30% de chance de ganhar
          const multiplier = winChance > 0.95 ? 10 : winChance > 0.85 ? 5 : 2;
          win = bet * multiplier;
          resMsg = `VOCÊ GANHOU R$ ${win.toFixed(2)}! (x${multiplier})`;
          
          const finalBalance = newBalanceAfterBet + win;
          await updateUserBalance(currentUser.id, finalBalance);
          await addTransaction({
            user_id: currentUser.id,
            type: 'win',
            amount: win,
            description: `Ganho no jogo ${gameName} (${provider})`,
            status: 'completed'
          });
        }

        setWinAmount(win);
        setResult(resMsg);
        setIsSpinning(false);
      }, 2000);

    } catch (err) {
      console.error('Erro ao processar giro:', err);
      setError('Erro técnico ao processar aposta.');
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="mr-2" size={20} /> Voltar para o Lobby
      </button>

      <div className="max-w-4xl mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        {/* Banner do Jogo */}
        <div className={`h-48 md:h-64 bg-gradient-to-r ${color} relative flex items-center justify-center overflow-hidden`}>
          <img src={bannerUrl} alt={gameName} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div className="relative text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-lg uppercase italic">
              {gameName}
            </h1>
            <p className="text-sm font-bold tracking-widest text-white/80 uppercase mt-2">
              Powered by {provider}
            </p>
          </div>
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center border border-white/10">
            <ShieldCheck className="text-green-400 mr-1" size={14} />
            <span className="text-[10px] font-bold text-white uppercase">Simulação Segura</span>
          </div>
        </div>

        {/* Área de Jogo */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Controles */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Seu Saldo</label>
                <p className="text-2xl font-mono font-bold text-green-400">R$ {userData?.balance.toFixed(2)}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Valor da Aposta</label>
                <div className="flex items-center justify-between">
                  <button onClick={() => setBet(Math.max(1, bet - 1))} className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center font-bold">-</button>
                  <span className="text-xl font-bold">R$ {bet.toFixed(2)}</span>
                  <button onClick={() => setBet(bet + 1)} className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center font-bold">+</button>
                </div>
              </div>

              <button 
                onClick={handleSpin}
                disabled={isSpinning}
                className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl ${
                  isSpinning 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : `bg-gradient-to-r ${color} hover:scale-[1.02] active:scale-95 shadow-purple-500/20`
                }`}
              >
                {isSpinning ? 'Girando...' : 'GIRAR AGORA'}
              </button>
            </div>

            {/* Visualização do Jogo */}
            <div className="md:col-span-2 flex flex-col items-center justify-center bg-black/40 rounded-3xl border border-gray-800 min-h-[300px] relative overflow-hidden">
              {isSpinning ? (
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 border-4 border-t-transparent rounded-full animate-spin mb-4 ${color.split(' ')[1]}`}></div>
                  <p className="text-gray-400 font-bold animate-pulse">SORTEANDO RESULTADO...</p>
                </div>
              ) : result ? (
                <div className="text-center animate-bounce">
                  <p className={`text-3xl md:text-5xl font-black mb-2 ${winAmount > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {result}
                  </p>
                  {winAmount > 0 && <p className="text-xl text-white/80">Parabéns!</p>}
                </div>
              ) : (
                <div className="text-center p-8">
                  <Play className="mx-auto mb-4 text-gray-700" size={64} />
                  <p className="text-gray-500 font-medium">Escolha sua aposta e clique em girar para começar a simulação.</p>
                </div>
              )}

              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center text-red-400 text-sm">
                  <Info className="mr-2 shrink-0" size={16} />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé do Jogo */}
        <div className="bg-gray-800/30 p-4 border-t border-gray-800 flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="text-[10px] text-gray-500 uppercase font-bold">RTP: 96.5%</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold">Volatilidade: Alta</div>
          </div>
          <div className="text-[10px] text-gray-500 uppercase font-bold">ID: {gameId.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

export default GenericSlot;
