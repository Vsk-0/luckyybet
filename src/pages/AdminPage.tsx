import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge'; // Import Badge component

interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  pixKey: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: any; // Firestore Timestamp
}

const AdminPage: React.FC = () => {
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'withdrawRequests'), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const fetchedRequests: WithdrawRequest[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRequests.push({ id: doc.id, ...doc.data() } as WithdrawRequest);
        });
        // Sort requests by date, newest first
        fetchedRequests.sort((a, b) => b.requestedAt?.toDate() - a.requestedAt?.toDate());
        setRequests(fetchedRequests);
      } catch (error) {
        console.error('Erro ao buscar solicitações de saque:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as solicitações de saque.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  const handleUpdateRequest = async (id: string, newStatus: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      const requestDocRef = doc(db, 'withdrawRequests', id);
      await updateDoc(requestDocRef, { status: newStatus });

      // Update local state
      setRequests(prevRequests =>
        prevRequests.map(req => (req.id === id ? { ...req, status: newStatus } : req))
                    .filter(req => req.status === 'pending') // Keep only pending requests visible after action
      );

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
                <TableCell>{req.requestedAt?.toDate()?.toLocaleString('pt-BR') ?? 'N/A'}</TableCell>
                <TableCell className="truncate max-w-xs">{req.userId}</TableCell>
                <TableCell>{req.amount.toFixed(2)}</TableCell>
                <TableCell>{req.pixKey}</TableCell>
                <TableCell>
                  <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}>
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateRequest(req.id, 'approved')}
                    disabled={processingId === req.id}
                  >
                    {processingId === req.id ? 'Processando...' : 'Aprovar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUpdateRequest(req.id, 'rejected')}
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

