import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig'; // Assuming firebaseConfig exports db
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast hook exists

const WithdrawPage: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [pixKey, setPixKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!currentUser) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para solicitar um saque.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um valor de saque válido.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // TODO: Add logic to check if user has sufficient balance before proceeding

    if (!pixKey.trim()) {
        toast({
            title: 'Erro',
            description: 'Por favor, insira sua chave Pix.',
            variant: 'destructive',
        });
        setLoading(false);
        return;
    }

    try {
      // Add withdrawal request to Firestore
      await addDoc(collection(db, 'withdrawRequests'), {
        userId: currentUser.uid,
        amount: withdrawAmount,
        pixKey: pixKey.trim(),
        status: 'pending', // Initial status
        requestedAt: serverTimestamp(),
      });

      toast({
        title: 'Sucesso',
        description: 'Sua solicitação de saque foi enviada com sucesso.',
      });
      setAmount('');
      setPixKey('');
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Solicitar Saque</h1>
      <form onSubmit={handleWithdrawRequest} className="space-y-4">
        <div>
          <Label htmlFor="amount">Valor do Saque (R$)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex: 50.00"
            required
            min="0.01" // Example minimum amount
            step="0.01"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="pixKey">Chave Pix</Label>
          <Input
            id="pixKey"
            type="text"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="CPF, CNPJ, E-mail, Telefone ou Chave Aleatória"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Processando...' : 'Solicitar Saque'}
        </Button>
      </form>
      {/* TODO: Display withdrawal history? */}
    </div>
  );
};

export default WithdrawPage;

