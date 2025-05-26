import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

    setLoading(true);
    try {
      // Salva na coleção principal /withdrawRequests
      await addDoc(collection(db, 'withdrawRequests'), {
        userId: currentUser.uid,
        amount: parseFloat(amount),
        pixKey: pixKey,
        status: 'pending', // Status inicial sempre pendente
        requestedAt: serverTimestamp(),
      });

      toast({ title: 'Sucesso', description: 'Sua solicitação de saque foi enviada.' });
      setAmount('');
      setPixKey('');
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      toast({ title: 'Erro', description: 'Ocorreu um erro ao enviar sua solicitação. Tente novamente.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Solicitar Saque</CardTitle>
          <CardDescription className="text-center">Insira o valor e sua chave Pix.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdrawRequest} className="space-y-4">
            <div>
              <Label htmlFor="amount">Valor do Saque (R$)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 50.00"
                min="0.01"
                step="0.01"
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Solicitar Saque'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawPage;

