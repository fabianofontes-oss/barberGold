'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, Loader2, ArrowRight } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    shopName: '',
    shopSlug: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Implementar criação de profile via Server Action
      // Por enquanto, apenas redireciona para o dashboard
      console.log('Setup data:', formData);
      
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireciona para dashboard
      router.push('/app/dashboard');
    } catch (err: any) {
      setError('Erro ao configurar perfil. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-amber-500 p-3 rounded-xl">
              <Scissors className="w-8 h-8 text-zinc-950" />
            </div>
            <h1 className="text-3xl font-bold text-white">BarberGOLD</h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Configuração Inicial</h2>
          <p className="text-zinc-400">
            Complete seu perfil para começar a usar o sistema
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome de Exibição */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nome de Exibição *
              </label>
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Como você quer ser chamado?"
                disabled={loading}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Telefone/WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                disabled={loading}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Nome da Barbearia */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nome da Barbearia *
              </label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  setFormData({ ...formData, shopName: name, shopSlug: slug });
                }}
                placeholder="Ex: Barbearia Premium Gold"
                disabled={loading}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Slug (auto-gerado) */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                URL da Barbearia
              </label>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-sm">barbergold.app/</span>
                <input
                  type="text"
                  required
                  value={formData.shopSlug}
                  onChange={(e) => setFormData({ ...formData, shopSlug: e.target.value })}
                  placeholder="premium-gold"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Esta será a URL pública da sua barbearia
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Configurando...
                </>
              ) : (
                <>
                  Começar a Usar
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Você poderá alterar essas informações depois nas configurações
        </p>
      </div>
    </div>
  );
}
