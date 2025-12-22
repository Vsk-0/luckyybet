import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { validateCPF, formatCPF, isMaiorDeIdade } from '../services/cpfValidation';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type KYCStep = 'dados-pessoais' | 'documentos' | 'revisao' | 'concluido';

const KYCModal = ({ isOpen, onClose, onSuccess }: KYCModalProps) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<KYCStep>('dados-pessoais');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dados pessoais
  const [cpf, setCpf] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');

  // Endereço
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Documentos
  const [documentoFrente, setDocumentoFrente] = useState<File | null>(null);
  const [documentoVerso, setDocumentoVerso] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const handleCPFChange = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned.length <= 11) {
      setCpf(formatCPF(cleaned));
    }
  };

  const handleCEPChange = async (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '');
    setCep(cleaned);

    // Buscar endereço automaticamente quando CEP tiver 8 dígitos
    if (cleaned.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setLogradouro(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleDadosPessoaisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar CPF
    if (!validateCPF(cpf)) {
      setError('CPF inválido. Verifique o número digitado.');
      return;
    }

    // Validar idade
    if (!isMaiorDeIdade(dataNascimento)) {
      setError('Você precisa ter 18 anos ou mais para se cadastrar.');
      return;
    }

    // Validar campos obrigatórios
    if (!nomeCompleto || !telefone || !cep || !logradouro || !numero || !cidade || !estado) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setStep('documentos');
  };

  const handleFileChange = (file: File | null, type: 'frente' | 'verso' | 'selfie') => {
    if (!file) return;

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('O arquivo deve ter no máximo 5MB.');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas.');
      return;
    }

    if (type === 'frente') setDocumentoFrente(file);
    if (type === 'verso') setDocumentoVerso(file);
    if (type === 'selfie') setSelfie(file);
    setError('');
  };

  const handleDocumentosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!documentoFrente || !documentoVerso || !selfie) {
      setError('Por favor, envie todos os documentos solicitados.');
      return;
    }

    setStep('revisao');
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser?.id}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Erro ao fazer upload do arquivo');
    }

    const { data } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Upload dos documentos
      const documentoFrenteUrl = await uploadFile(documentoFrente!, 'documentos');
      const documentoVersoUrl = await uploadFile(documentoVerso!, 'documentos');
      const selfieUrl = await uploadFile(selfie!, 'selfies');

      // Salvar dados KYC no banco
      const { error: kycError } = await supabase
        .from('user_kyc')
        .insert({
          user_id: currentUser.id,
          cpf: cpf.replace(/[^\d]/g, ''),
          cpf_validado: validateCPF(cpf),
          nome_completo: nomeCompleto,
          data_nascimento: dataNascimento,
          telefone: telefone,
          endereco_cep: cep,
          endereco_logradouro: logradouro,
          endereco_numero: numero,
          endereco_complemento: complemento,
          endereco_bairro: bairro,
          endereco_cidade: cidade,
          endereco_estado: estado,
          documento_frente_url: documentoFrenteUrl,
          documento_verso_url: documentoVersoUrl,
          selfie_url: selfieUrl,
          status_verificacao: 'pending',
        });

      if (kycError) {
        throw new Error(kycError.message);
      }

      // Registrar no log de auditoria
      await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        event_type: 'KYC_SUBMITTED',
        event_data: { cpf_validado: validateCPF(cpf) },
      });

      setStep('concluido');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error('Erro ao enviar KYC:', err);
      setError(err.message || 'Erro ao enviar documentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400">
            Verificação de Identidade (KYC)
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Para sua segurança e conformidade legal, precisamos verificar sua identidade.
          </DialogDescription>
        </DialogHeader>

        {/* Indicador de Progresso */}
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center ${step === 'dados-pessoais' ? 'text-purple-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'dados-pessoais' ? 'bg-purple-600' : 'bg-gray-600'}`}>
              1
            </div>
            <span className="ml-2 text-sm">Dados Pessoais</span>
          </div>
          <div className="flex-1 h-1 bg-gray-600 mx-2"></div>
          <div className={`flex items-center ${step === 'documentos' ? 'text-purple-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'documentos' ? 'bg-purple-600' : 'bg-gray-600'}`}>
              2
            </div>
            <span className="ml-2 text-sm">Documentos</span>
          </div>
          <div className="flex-1 h-1 bg-gray-600 mx-2"></div>
          <div className={`flex items-center ${step === 'revisao' ? 'text-purple-400' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'revisao' ? 'bg-purple-600' : 'bg-gray-600'}`}>
              3
            </div>
            <span className="ml-2 text-sm">Revisão</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded-lg mb-4 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        {/* Etapa 1: Dados Pessoais */}
        {step === 'dados-pessoais' && (
          <form onSubmit={handleDadosPessoaisSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => handleCPFChange(e.target.value)}
                placeholder="000.000.000-00"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="nomeCompleto">Nome Completo *</Label>
              <Input
                id="nomeCompleto"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={cep}
                  onChange={(e) => handleCEPChange(e.target.value)}
                  placeholder="00000-000"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="logradouro">Logradouro *</Label>
                <Input
                  id="logradouro"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  placeholder="Rua, Avenida, etc."
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="123"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Apto, Bloco, etc."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Continuar
            </Button>
          </form>
        )}

        {/* Etapa 2: Documentos */}
        {step === 'documentos' && (
          <form onSubmit={handleDocumentosSubmit} className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4">
              <h3 className="text-blue-300 font-semibold mb-2">📋 Documentos Aceitos</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• RG (Registro Geral)</li>
                <li>• CNH (Carteira Nacional de Habilitação)</li>
                <li>• Passaporte</li>
              </ul>
            </div>

            <div>
              <Label>Documento (Frente) *</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      {documentoFrente ? documentoFrente.name : 'Clique para enviar'}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'frente')}
                  />
                </label>
              </div>
            </div>

            <div>
              <Label>Documento (Verso) *</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      {documentoVerso ? documentoVerso.name : 'Clique para enviar'}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'verso')}
                  />
                </label>
              </div>
            </div>

            <div>
              <Label>Selfie Segurando o Documento *</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      {selfie ? selfie.name : 'Clique para enviar'}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'selfie')}
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('dados-pessoais')}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                Continuar
              </Button>
            </div>
          </form>
        )}

        {/* Etapa 3: Revisão */}
        {step === 'revisao' && (
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-purple-400">Dados Pessoais</h3>
              <p className="text-sm text-gray-300">CPF: {cpf}</p>
              <p className="text-sm text-gray-300">Nome: {nomeCompleto}</p>
              <p className="text-sm text-gray-300">Data de Nascimento: {new Date(dataNascimento).toLocaleDateString()}</p>
              <p className="text-sm text-gray-300">Telefone: {telefone}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-purple-400">Endereço</h3>
              <p className="text-sm text-gray-300">
                {logradouro}, {numero} {complemento && `- ${complemento}`}
              </p>
              <p className="text-sm text-gray-300">
                {bairro}, {cidade} - {estado}
              </p>
              <p className="text-sm text-gray-300">CEP: {cep}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-purple-400">Documentos</h3>
              <p className="text-sm text-gray-300">✓ Documento (Frente): {documentoFrente?.name}</p>
              <p className="text-sm text-gray-300">✓ Documento (Verso): {documentoVerso?.name}</p>
              <p className="text-sm text-gray-300">✓ Selfie: {selfie?.name}</p>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                ⚠️ Ao confirmar, você declara que todas as informações fornecidas são verdadeiras e está ciente de que a falsificação de documentos é crime.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('documentos')}
                className="flex-1"
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                onClick={handleFinalSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Confirmar e Enviar'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Etapa 4: Concluído */}
        {step === 'concluido' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <CheckCircle className="text-green-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Verificação Enviada!</h3>
            <p className="text-gray-300 mb-4">
              Seus documentos foram enviados com sucesso e estão em análise.
            </p>
            <p className="text-sm text-gray-400">
              Você receberá uma notificação assim que a verificação for concluída (geralmente em até 24 horas).
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KYCModal;
