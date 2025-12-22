/**
 * Página: Política de Privacidade
 * 
 * NOTA: Este é um template básico. Consulte um advogado para política real conforme LGPD.
 */

'use client'

import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.push('/')}
          className="mb-8 text-gray-600 hover:text-gray-900 font-semibold"
        >
          ← Voltar
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidade
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: Dezembro de 2025
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Aviso Legal:</strong> Este é um template básico. 
              Consulte um advogado para criar uma política conforme LGPD.
            </p>
          </div>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
              <p className="text-gray-700 mb-2">
                Coletamos as seguintes informações:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Dados de Cadastro:</strong> nome, email, telefone, CPF/CNPJ</li>
                <li><strong>Dados de Uso:</strong> logs de acesso, IP, navegador</li>
                <li><strong>Dados de Clientes:</strong> informações inseridas por você sobre seus clientes</li>
                <li><strong>Dados de Pagamento:</strong> processados pelo Stripe (não armazenamos cartões)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos seus Dados</h2>
              <p className="text-gray-700 mb-2">
                Utilizamos seus dados para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos</li>
                <li>Enviar notificações importantes</li>
                <li>Suporte técnico</li>
                <li>Análises e estatísticas (dados anonimizados)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Dados</h2>
              <p className="text-gray-700 mb-2">
                Compartilhamos dados apenas com:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Stripe:</strong> para processar pagamentos</li>
                <li><strong>Supabase/AWS:</strong> para armazenamento seguro</li>
                <li><strong>Autoridades:</strong> quando exigido por lei</li>
              </ul>
              <p className="text-gray-700 mt-2">
                <strong>Nunca vendemos seus dados para terceiros.</strong>
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança</h2>
              <p className="text-gray-700">
                Implementamos medidas de segurança incluindo: criptografia SSL/TLS, 
                armazenamento seguro, backups regulares, controle de acesso e monitoramento.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos (LGPD)</h2>
              <p className="text-gray-700 mb-2">
                Você tem direito a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar exclusão de dados</li>
                <li>Revogar consentimento</li>
                <li>Portabilidade de dados</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Para exercer seus direitos, entre em contato: privacidade@barber.gold
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
              <p className="text-gray-700">
                Usamos cookies essenciais para funcionamento do sistema e cookies de 
                análise (opcional). Você pode desabilitar cookies nas configurações do navegador.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
              <p className="text-gray-700">
                Mantemos seus dados enquanto sua conta estiver ativa. Após cancelamento, 
                dados são mantidos por 90 dias para possível recuperação, depois são excluídos.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Alterações nesta Política</h2>
              <p className="text-gray-700">
                Podemos atualizar esta política. Mudanças significativas serão notificadas 
                por email com 30 dias de antecedência.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contato</h2>
              <p className="text-gray-700">
                <strong>Encarregado de Dados (DPO):</strong> privacidade@barber.gold<br />
                <strong>Suporte Geral:</strong> contato@barber.gold
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

