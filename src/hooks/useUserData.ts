import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserData, UserData } from '../services/userService';

export const useUserData = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserData(currentUser.uid);
        setUserData(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        setError('Falha ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return { userData, loading, error };
};

export default useUserData;
