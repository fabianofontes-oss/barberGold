/**
 * Página: Termos de Uso
 * 
 * NOTA: Este é um template básico. Consulte um advogado para termos legais reais.
 */

'use client'

import { useRouter } from 'next/navigation'

export default function TermsPage() {
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
            Termos de Uso
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: Dezembro de 2025
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Aviso Legal:</strong> Este é um template básico de Termos de Uso. 
              Consulte um advogado especializado para criar termos adequados ao seu negócio.
            </p>
          </div>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700">
                Ao acessar e usar o BarberFlow, você concorda com estes Termos de Uso. 
                Se você não concordar com algum termo, não utilize nossos serviços.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-700">
                O BarberFlow é uma plataforma SaaS para gestão de barbearias, oferecendo 
                funcionalidades como agendamento, controle financeiro, gestão de clientes e relatórios.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cadastro e Conta</h2>
              <p className="text-gray-700 mb-2">
                Para usar nossos serviços, você deve:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter a segurança de sua senha</li>
                <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Planos e Pagamentos</h2>
              <p className="text-gray-700 mb-2">
                - Planos pagos são cobrados mensalmente ou anualmente<br />
                - Você pode cancelar a qualquer momento<br />
                - Não há reembolso proporcional em cancelamentos<br />
                - Preços podem ser alterados com aviso prévio de 30 dias
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Uso Aceitável</h2>
              <p className="text-gray-700 mb-2">
                Você concorda em NÃO:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Violar leis ou regulamentos</li>
                <li>Compartilhar sua conta com terceiros</li>
                <li>Tentar acessar sistemas não autorizados</li>
                <li>Fazer engenharia reversa do software</li>
                <li>Usar para spam ou atividades maliciosas</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriedade Intelectual</h2>
              <p className="text-gray-700">
                Todo o conteúdo, marcas e código do BarberFlow são de nossa propriedade. 
                Você mantém propriedade de seus dados inseridos no sistema.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-gray-700">
                O serviço é fornecido "como está". Não garantimos disponibilidade 100% 
                e não somos responsáveis por perdas indiretas ou lucros cessantes.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modificações</h2>
              <p className="text-gray-700">
                Podemos modificar estes termos a qualquer momento. Mudanças significativas 
                serão notificadas por email com 30 dias de antecedência.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contato</h2>
              <p className="text-gray-700">
                Para questões sobre estes termos, entre em contato: contato@barber.gold
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

