import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
// devem ser definidas no arquivo .env na raiz do projeto.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem ser definidas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
