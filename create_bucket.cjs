const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ceexfkjldhsbpugxvuyn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlZXhma2psZGhzYnB1Z3h2dXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5MDI3MiwiZXhwIjoyMDg0MzY2MjcyfQ.RfVB4rNyjx4Xc3A4eJClRISfluNX6mJrLmhY0_D96hs';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createKycBucket() {
  console.log('Tentando criar o bucket "kyc-documents"...');
  
  const { data, error } = await supabase.storage.createBucket('kyc-documents', {
    public: false,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    fileSizeLimit: 5242880 // 5MB
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('O bucket "kyc-documents" já existe.');
    } else {
      console.error('Erro ao criar bucket:', error.message);
      process.exit(1);
    }
  } else {
    console.log('Bucket "kyc-documents" criado com sucesso:', data);
  }
}

createKycBucket();
