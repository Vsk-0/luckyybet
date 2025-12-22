import { supabase } from '../supabaseClient';

// Interface para dados do usuário (tabela 'users')
export interface UserData {
  id: string; // Corresponde ao user.id do Supabase
  email: string;
  balance: number;
  is_admin: boolean; // Novo campo para status de admin
  created_at: string; // Supabase usa created_at (string ISO)
  updated_at: string;
}

// Interface para transações (tabela 'transactions')
export interface Transaction {
  id?: number; // Supabase usa ID numérico auto-incrementado
  user_id: string; // Corresponde ao user.id do Supabase
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string; // Supabase usa created_at (string ISO)
}

// A criação de dados iniciais do usuário (tabela 'users') é agora gerenciada por um trigger no Supabase após o registro.

// Buscar dados do usuário
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }

    return data as UserData | null;
  } catch (error) {
    console.error('Erro inesperado ao buscar dados do usuário:', error);
    return null;
  }
};

// Atualizar saldo do usuário (Atenção: Esta função deve ser protegida por RLS)
export const updateUserBalance = async (uid: string, newBalance: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', uid);

    if (error) {
      console.error('Erro ao atualizar saldo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado ao atualizar saldo:', error);
    return false;
  }
};

// Adicionar transação ao histórico
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          ...transaction,
          created_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao adicionar transação:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Erro inesperado ao adicionar transação:', error);
    return null;
  }
};

// Buscar histórico de transações
export const getUserTransactions = async (uid: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar transações:', error);
      return [];
    }

    return (data as Transaction[]) || [];
  } catch (error) {
    console.error('Erro inesperado ao buscar transações:', error);
    return [];
  }
};

// Criar solicitação de depósito (Simulação de Pix)
export const createDepositRequest = async (
  userId: string,
  amount: number,
  pixKey: string,
  proofImageUrl?: string
): Promise<number | null> => {
  try {
    // 1. Registrar a solicitação de depósito na tabela 'deposit_requests'
    const { data: depositData, error: depositError } = await supabase
      .from('deposit_requests')
      .insert([
        {
          user_id: userId,
          amount,
          pix_key: pixKey,
          status: 'pending',
          proof_image_url: proofImageUrl,
        },
      ])
      .select('id')
      .single();

    if (depositError) {
      console.error('Erro ao criar solicitação de depósito:', depositError);
      return null;
    }

    // 2. Adicionar também como transação pendente no histórico
    await addTransaction({
      user_id: userId,
      type: 'deposit',
      amount,
      description: `Depósito via Pix (${pixKey})`,
      status: 'pending',
    });

    return depositData.id;
  } catch (error) {
    console.error('Erro inesperado ao criar solicitação de depósito:', error);
    return null;
  }
};
