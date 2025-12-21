import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { updateUserBalance, addTransaction } from '../services/userService';

interface WithdrawRequest {
  id: number;
  user_id: string;
  amount: number;
  pix_key: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string; // Supabase timestamp
}

const AdminPage: React.FC = () => {
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Busca na tabela 'withdraw_requests', ordenando pelos mais recentes
      const { data, error } = await supabase
        .from('withdraw_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data as WithdrawRequest[]);
    } catch (error) {
      console.error('Erro ao buscar solicitações de saque:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as solicitações de saque pendentes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [toast]);

  const handleUpdateRequest = async (request: WithdrawRequest, newStatus: 'approved' | 'rejected') => {
    setProcessingId(request.id);
    try {
      // 1. Atualiza o status na tabela 'withdraw_requests'
      const { error: updateError } = await supabase
        .from('withdraw_requests')
        .update({ status: newStatus })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // 2. Se aprovado, atualiza o saldo do usuário e registra a transação
      if (newStatus === 'approved') {
        // Em um cenário real, isso seria feito com uma função de banco de dados
        // para garantir a atomicidade. Aqui, simulamos a lógica de negócio.
        
        // Busca o saldo atual (necessário para o update)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('balance')
          .eq('id', request.user_id)
          .single();

        if (userError || !userData) throw new Error('Usuário não encontrado.');

        const newBalance = userData.balance - request.amount;
        
        // Atualiza o saldo
        const success = await updateUserBalance(request.user_id, newBalance);
        if (!success) throw new Error('Falha ao atualizar saldo do usuário.');

        // Registra a transação de saque como concluída
        await addTransaction({
          user_id: request.user_id,
          type: 'withdrawal',
          amount: request.amount,
          description: `Saque via Pix (${request.pix_key})`,
          status: 'completed',
        });
      }
      
      // 3. Remove a solicitação da lista local
      setRequests(prevRequests => prevRequests.filter(req => req.id !== request.id));

      toast({
        title: 'Sucesso',
        description: `Solicitação ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`,
      });
    } catch (error) {
      console.error(`Erro ao ${newStatus === 'approved' ? 'aprovar' : 'rejeitar'} solicitação:`, error);
      toast({
        title: 'Erro',
        description: `Ocorreu um erro ao ${newStatus === 'approved' ? 'aprovar' : 'rejeitar'} a solicitação. Tente novamente.`,
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Painel de Administração - Saques Pendentes</h1>

      {loading ? (
        <p className="text-center">Carregando solicitações...</p>
      ) : requests.length === 0 ? (
        <p className="text-center">Nenhuma solicitação de saque pendente encontrada.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Usuário ID</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead>Chave Pix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{new Date(req.created_at).toLocaleString('pt-BR')}</TableCell>
                {/* Truncar User ID para melhor visualização se necessário */}
                <TableCell className="truncate max-w-[100px]" title={req.user_id}>{req.user_id}</TableCell> 
                <TableCell>{req.amount.toFixed(2)}</TableCell>
                <TableCell>{req.pix_key}</TableCell>
                <TableCell>
                  <Badge variant={'secondary'}> {/* Sempre será pending aqui */}
                    Pendente
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateRequest(req, 'approved')}
                    disabled={processingId === req.id}
                  >
                    {processingId === req.id ? 'Processando...' : 'Aprovar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUpdateRequest(req, 'rejected')}
                    disabled={processingId === req.id}
                  >
                    {processingId === req.id ? 'Processando...' : 'Rejeitar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminPage;
