import { auth, db } from '../firebaseConfig';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
  DocumentData
} from 'firebase/firestore';

// Interface para dados do usuário
export interface UserData {
  uid: string;
  email: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para transações
export interface Transaction {
  id?: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: Date;
}

// Criar ou atualizar dados do usuário
export const createOrUpdateUser = async (uid: string, email: string): Promise<UserData> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Criar novo usuário se não existir
    const userData: UserData = {
      uid,
      email,
      balance: 100, // Saldo inicial para demonstração
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(userRef, userData);
    return userData;
  }

  // Retornar dados existentes
  return userSnap.data() as UserData;
};

// Buscar dados do usuário
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        uid,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as UserData;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
};

// Atualizar saldo do usuário
export const updateUserBalance = async (uid: string, newBalance: number): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      balance: newBalance,
      updatedAt: new Date()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Erro ao atualizar saldo:', error);
    return false;
  }
};

// Adicionar transação ao histórico
export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<string | null> => {
  try {
    const userRef = doc(db, 'users', transaction.userId);
    const transactionsRef = collection(userRef, 'transactions');

    const docRef = await addDoc(transactionsRef, {
      ...transaction,
      createdAt: Timestamp.fromDate(transaction.createdAt)
    });

    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    return null;
  }
};

// Buscar histórico de transações
export const getUserTransactions = async (uid: string): Promise<Transaction[]> => {
  try {
    const userRef = doc(db, 'users', uid);
    const transactionsRef = collection(userRef, 'transactions');
    const q = query(transactionsRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Transaction);
    });

    return transactions;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return [];
  }
};

// Criar solicitação de depósito
export const createDepositRequest = async (
  userId: string,
  amount: number,
  pixKey: string,
  proofImageUrl?: string
): Promise<string | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const depositRequestsRef = collection(userRef, 'depositRequests');

    // Construir o objeto de dados, incluindo proofImageUrl apenas se definido
    const depositData: DocumentData = {
      userId,
      amount,
      pixKey,
      status: 'pending',
      createdAt: Timestamp.fromDate(new Date())
    };

    if (proofImageUrl) {
      depositData.proofImageUrl = proofImageUrl;
    }

    const docRef = await addDoc(depositRequestsRef, depositData);

    // Adicionar também como transação pendente
    await addTransaction({
      userId,
      type: 'deposit',
      amount,
      description: `Depósito via Pix (${pixKey})`,
      status: 'pending',
      createdAt: new Date()
    });

    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar solicitação de depósito:', error);
    return null;
  }
};
