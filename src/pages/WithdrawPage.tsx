import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '../supabaseClient';

const WithdrawPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [pixKey, setPixKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: 'Erro', description: 'Você precisa estar logado para solicitar um saque.', variant: 'destructive' });
      return;
    }
    if (!amount || !pixKey || parseFloat(amount) <= 0) {
      toast({ title: 'Erro', description: 'Por favor, preencha o valor e a chave Pix corretamente.', variant: 'destructive' });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < 10) {
      toast({ title: 'Erro', description: 'O valor mínimo para saque é R$ 10,00.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Inserir solicitação de saque na tabela withdraw_requests
      const { error } = await supabase
        .from('withdraw_requests')
        .insert([
          {
            user_id: currentUser.id,
            amount: withdrawAmount,
            pix_key: pixKey,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar solicitação de saque:', error);
        toast({ title: 'Erro', description: 'Ocorreu um erro ao enviar sua solicitação. Tente novamente.', variant: 'destructive' });
        return;
      }

      // Adicionar transação no histórico
      await supabase
        .from('transactions')
        .insert([
          {
            user_id: currentUser.id,
            type: 'withdrawal',
            amount: withdrawAmount,
            description: `Solicitação de saque via Pix (${pixKey})`,
            status: 'pending',
          },
        ]);

      toast({ title: 'Sucesso', description: 'Sua solicitação de saque foi enviada e será processada em breve.' });
      setAmount('');
      setPixKey('');
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      toast({ title: 'Erro', description: 'Ocorreu um erro inesperado. Tente novamente.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white">Solicitar Saque</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Insira o valor e sua chave Pix para receber o saque.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdrawRequest} className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-gray-300">Valor do Saque (R$)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 50.00"
                min="10"
                step="0.01"
                required
                disabled={loading}
                className="bg-gray-700 border-gray-600 text-white focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Valor mínimo: R$ 10,00</p>
            </div>
            <div>
              <Label htmlFor="pixKey" className="text-gray-300">Chave Pix</Label>
              <Input
                id="pixKey"
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, CNPJ, E-mail, Telefone ou Chave Aleatória"
                required
                disabled={loading}
                className="bg-gray-700 border-gray-600 text-white focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                O saque será processado em até 24 horas úteis
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold" 
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Solicitar Saque'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawPage;
