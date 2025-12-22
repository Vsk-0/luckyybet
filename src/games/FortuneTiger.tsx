import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { verificarLimiteAposta } from '../services/responsibleGaming';
import { Loader2, RefreshCw, DollarSign, XCircle, CheckCircle } from 'lucide-react';

// Constantes do Jogo
const SYMBOLS = ['🐯', '💰', '🎋', '🍊', '🍇'];
const PAYOUTS: { [key: string]: number } = {
  '🐯': 10,
  '💰': 5,
  '🎋': 3,
  '🍊': 2,
  '🍇': 1,
};
const MAX_BET = 100;
const MIN_BET = 1;

interface SlotResult {
  reel1: string;
  reel2: string;
  reel3: string;
}

const FortuneTiger: React.FC = () => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(MIN_BET);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SlotResult>({ reel1: '?', reel2: '?', reel3: '?' });
  const [message, setMessage] = useState('');
  const [winAmount, setWinAmount] = useState(0);
  const [error, setError] = useState('');

  // Função para buscar o saldo do usuário
  const fetchBalance = useCallback(async () => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id', currentUser.id)
      .single();

    if (error) {
      console.error('Erro ao buscar saldo:', error);
      return;
    }
    setBalance(data?.balance || 0);
  }, [currentUser]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Função para atualizar o saldo no banco de dados
  const updateBalance = async (newBalance: number) => {
    if (!currentUser) return;
    const { error } = await supabase
      .from('users')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', currentUser.id);

    if (error) {
      console.error('Erro ao atualizar saldo:', error);
      setError('Erro ao atualizar saldo. Tente novamente.');
      return false;
    }
    setBalance(newBalance);
    return true;
  };

  // Lógica de Geração de Resultado (RNG)
  const generateResult = (): SlotResult => {
    const reel1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const reel2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const reel3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    return { reel1, reel2, reel3 };
  };

  // Lógica de Cálculo de Ganho
  const calculateWin = (res: SlotResult, bet: number): number => {
    if (res.reel1 === res.reel2 && res.reel2 === res.reel3) {
      // Três símbolos iguais
      const symbol = res.reel1;
      const payoutMultiplier = PAYOUTS[symbol] || 0;
      return bet * payoutMultiplier;
    }
    // Sem ganho
    return 0;
  };

  // Função Principal de Spin
  const handleSpin = async () => {
    if (!currentUser) {
      setError('Você precisa estar logado para jogar.');
      return;
    }
    if (isSpinning) return;
    setError('');
    setMessage('');
    setWinAmount(0);

    // 1. Verificar Limites de Aposta (Jogo Responsável)
    const limiteCheck = await verificarLimiteAposta(currentUser.id, betAmount);
    if (!limiteCheck.permitido) {
      setError(limiteCheck.motivo || 'Limite de aposta excedido. Jogue com responsabilidade.');
      return;
    }

    // 2. Verificar Saldo
    if (balance < betAmount) {
      setError('Saldo insuficiente. Faça um depósito.');
      return;
    }

    setIsSpinning(true);

    // 3. Deduzir Aposta
    const newBalanceAfterBet = balance - betAmount;
    if (!(await updateBalance(newBalanceAfterBet))) {
      setIsSpinning(false);
      return;
    }

    // 4. Simular Spin (Animação)
    const spinDuration = 2000; // 2 segundos
    const intervalTime = 100;
    let startTime = Date.now();

    const spinInterval = setInterval(() => {
      if (Date.now() - startTime < spinDuration) {
        // Atualiza os símbolos aleatoriamente durante o spin
        setResult(generateResult());
      } else {
        clearInterval(spinInterval);
        
        // 5. Gerar Resultado Final
        const finalResult = generateResult();
        setResult(finalResult);

        // 6. Calcular Ganho
        const win = calculateWin(finalResult, betAmount);
        setWinAmount(win);

        // 7. Atualizar Saldo com Ganho
        if (win > 0) {
          const finalBalance = newBalanceAfterBet + win;
          updateBalance(finalBalance);
          setMessage(`🎉 Parabéns! Você ganhou R$ ${win.toFixed(2)}!`);
        } else {
          setMessage('Tente novamente!');
        }

        // 8. Registrar Sessão de Jogo (Auditoria)
        supabase.from('game_sessions').insert({
          user_id: currentUser.id,
          game_name: 'Fortune Tiger',
          bet_amount: betAmount,
          win_amount: win,
          result: JSON.stringify(finalResult),
          session_end: new Date().toISOString(),
        }).then(({ error }) => {
          if (error) console.error('Erro ao registrar sessão de jogo:', error);
        });

        setIsSpinning(false);
      }
    }, intervalTime);
  };

  // Componente de Slot Individual
  const Slot: React.FC<{ symbol: string }> = ({ symbol }) => (
    <div className="bg-gray-900 border-4 border-yellow-500 rounded-lg w-24 h-24 flex items-center justify-center text-5xl shadow-inner shadow-yellow-800">
      {symbol}
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg mx-auto border-2 border-yellow-600">
      <h1 className="text-3xl font-extrabold text-center text-yellow-400 mb-4 flex items-center justify-center">
        <img src="/tiger-icon.png" alt="Tiger" className="w-8 h-8 mr-2" />
        Fortune Tiger
      </h1>
      <p className="text-center text-gray-400 mb-6">O jogo do tigrinho para o concurso!</p>

      {/* Display de Saldo */}
      <div className="flex justify-between items-center bg-gray-900 p-3 rounded-lg mb-6 border border-gray-700">
        <span className="text-gray-300 font-semibold flex items-center">
          <DollarSign className="text-green-500 mr-2" size={20} />
          Saldo Atual:
        </span>
        <span className="text-2xl font-bold text-green-400">
          R$ {balance.toFixed(2)}
        </span>
      </div>

      {/* Área de Slots */}
      <div className="flex justify-around mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <Slot symbol={result.reel1} />
        <Slot symbol={result.reel2} />
        <Slot symbol={result.reel3} />
      </div>

      {/* Mensagens de Status */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 flex items-center justify-center">
          <XCircle className="mr-2" size={20} />
          {error}
        </div>
      )}
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-center font-bold ${winAmount > 0 ? 'bg-green-900/50 border border-green-700 text-green-300' : 'bg-blue-900/50 border border-blue-700 text-blue-300'}`}>
          {message}
        </div>
      )}

      {/* Controles de Aposta */}
      <div className="flex justify-between items-center mb-4">
        <label className="text-gray-300 font-semibold">Valor da Aposta:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => {
            const newBet = parseFloat(e.target.value);
            if (newBet >= MIN_BET && newBet <= MAX_BET) {
              setBetAmount(newBet);
            }
          }}
          min={MIN_BET}
          max={MAX_BET}
          step="1"
          className="w-24 bg-gray-900 border border-gray-700 text-white p-2 rounded-lg text-center focus:outline-none focus:border-yellow-500"
          disabled={isSpinning}
        />
      </div>

      {/* Botão de Spin */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || balance < betAmount}
        className={`w-full py-3 rounded-lg font-bold text-lg transition duration-300 flex items-center justify-center ${
          isSpinning || balance < betAmount
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 shadow-lg shadow-yellow-900/50'
        }`}
      >
        {isSpinning ? (
          <>
            <Loader2 className="animate-spin mr-2" size={24} />
            GIRANDO...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2" size={24} />
            GIRAR (R$ {betAmount.toFixed(2)})
          </>
        )}
      </button>

      {/* Tabela de Pagamentos (Simulada) */}
      <div className="mt-6 text-center">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">Tabela de Pagamentos</h3>
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 inline-block">
          <ul className="text-gray-300 text-sm space-y-1">
            {Object.entries(PAYOUTS).map(([symbol, multiplier]) => (
              <li key={symbol} className="flex justify-between">
                <span className="mr-4">{symbol} {symbol} {symbol}</span>
                <span className="font-bold text-yellow-300">x{multiplier}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FortuneTiger;
