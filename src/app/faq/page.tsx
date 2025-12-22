/**
 * Página de FAQ - Perguntas Frequentes
 * 
 * FAQ completo com categorias e busca
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'geral' | 'planos' | 'pagamentos' | 'tecnico' | 'funcionalidades'
}

const FAQ_ITEMS: FAQItem[] = [
  // GERAL
  {
    category: 'geral',
    question: 'O que é o BarberFlow?',
    answer: 'O BarberFlow é um sistema completo de gestão para barbearias e salões. Oferecemos agendamento online, controle financeiro, gestão de clientes, sistema de comissões, programa de fidelidade e muito mais. Tudo em uma plataforma moderna e fácil de usar.',
  },
  {
    category: 'geral',
    question: 'Como funciona o plano FREE?',
    answer: 'O plano FREE é completamente gratuito e permite que você teste o sistema sem compromisso. Inclui 1 profissional, até 30 agendamentos por mês, gestão básica de clientes e agenda simples. Não requer cartão de crédito e você pode usar por tempo indeterminado.',
  },
  {
    category: 'geral',
    question: 'Posso testar antes de pagar?',
    answer: 'Sim! Você pode começar com o plano FREE gratuitamente e testar todas as funcionalidades básicas. Quando quiser mais recursos (como agendamento online, comissões e relatórios avançados), basta fazer upgrade para um plano pago.',
  },
  {
    category: 'geral',
    question: 'Preciso instalar algum programa?',
    answer: 'Não! O BarberFlow funciona 100% na nuvem através do navegador. Basta acessar barber.gold de qualquer computador, tablet ou celular com internet. Não precisa instalar nada.',
  },
  {
    category: 'geral',
    question: 'Funciona no celular?',
    answer: 'Sim! O BarberFlow é totalmente responsivo e funciona perfeitamente em celulares e tablets. Você pode gerenciar sua barbearia de qualquer lugar, a qualquer momento.',
  },
  
  // PLANOS
  {
    category: 'planos',
    question: 'Qual a diferença entre os planos?',
    answer: 'FREE: 1 profissional, 30 agendamentos/mês, recursos básicos. SOLO: 1 profissional, agendamentos ilimitados, PDV completo. SOLO PRO: Tudo do SOLO + agendamento online, comissões, fidelidade. TEAM: Até 5 profissionais + gestão de estoque. PREMIUM: Até 10 profissionais + multi-unidade. ENTERPRISE: Ilimitado + white-label.',
  },
  {
    category: 'planos',
    question: 'Quantos barbeiros posso cadastrar?',
    answer: 'Depende do seu plano: FREE/SOLO/SOLO PRO: 1 profissional. TEAM: até 5. PREMIUM: até 10. ENTERPRISE: ilimitado. Cada profissional pode ter seu próprio login e agenda.',
  },
  {
    category: 'planos',
    question: 'Como faço upgrade de plano?',
    answer: 'É muito simples! Acesse Configurações > Planos e Pagamentos, escolha o novo plano e clique em "Fazer Upgrade". A mudança é imediata e você já terá acesso aos novos recursos. O valor é proporcional ao tempo restante do mês.',
  },
  {
    category: 'planos',
    question: 'Posso fazer downgrade?',
    answer: 'Sim, você pode fazer downgrade a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança. Atenção: ao fazer downgrade, recursos avançados podem ser desativados.',
  },
  {
    category: 'planos',
    question: 'Posso cancelar quando quiser?',
    answer: 'Sim! Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento direto no painel de controle. Não cobramos taxa de cancelamento e você continua usando até o fim do período pago.',
  },
  {
    category: 'planos',
    question: 'Tem desconto no plano anual?',
    answer: 'Sim! Planos anuais têm 20% de desconto em relação ao mensal. Ou seja, você paga 10 meses e ganha 2 de graça! É a melhor forma de economizar.',
  },
  
  // PAGAMENTOS
  {
    category: 'pagamentos',
    question: 'Quais formas de pagamento aceitam?',
    answer: 'Aceitamos todos os principais cartões de crédito: Visa, Mastercard, American Express, Elo, Diners e Discover. Os pagamentos são processados de forma segura pelo Stripe, líder mundial em pagamentos online.',
  },
  {
    category: 'pagamentos',
    question: 'É seguro cadastrar meu cartão?',
    answer: 'Sim, totalmente seguro! Não armazenamos dados do seu cartão em nossos servidores. Todas as transações são processadas pelo Stripe, certificado PCI DSS Level 1 (o mais alto nível de segurança da indústria de pagamentos).',
  },
  {
    category: 'pagamentos',
    question: 'Quando sou cobrado?',
    answer: 'Planos mensais: cobrança todo dia do mês em que você assinou. Planos anuais: cobrança única no ato da assinatura. Você recebe um email com a fatura após cada cobrança.',
  },
  {
    category: 'pagamentos',
    question: 'Tem taxa de setup ou adesão?',
    answer: 'Não! Não cobramos nenhuma taxa de setup, adesão ou ativação. Você paga apenas o valor do plano escolhido, sem surpresas.',
  },
  {
    category: 'pagamentos',
    question: 'O que acontece se o pagamento falhar?',
    answer: 'Se houver falha no pagamento, tentamos cobrar novamente automaticamente nos próximos dias. Você receberá um email avisando. Se após várias tentativas não conseguirmos cobrar, sua conta será suspensa temporariamente até regularizar.',
  },
  {
    category: 'pagamentos',
    question: 'Posso mudar meu cartão de crédito?',
    answer: 'Sim! Acesse Configurações > Planos e Pagamentos > Gerenciar Assinatura. Lá você pode atualizar seu cartão, ver faturas antigas e gerenciar tudo relacionado a pagamentos.',
  },
  
  // TÉCNICO
  {
    category: 'tecnico',
    question: 'Funciona offline?',
    answer: 'Não, o BarberFlow requer conexão com internet para funcionar, pois todos os dados ficam na nuvem. Isso garante que você possa acessar de qualquer dispositivo e que seus dados estejam sempre seguros e sincronizados.',
  },
  {
    category: 'tecnico',
    question: 'Como faço backup dos meus dados?',
    answer: 'Planos PREMIUM e ENTERPRISE incluem backup automático diário. Para outros planos, você pode exportar seus dados em Excel/CSV a qualquer momento em Relatórios > Exportar Dados. Recomendamos fazer exports mensais.',
  },
  {
    category: 'tecnico',
    question: 'Meus dados estão seguros?',
    answer: 'Sim! Usamos criptografia SSL/TLS em todas as conexões, armazenamento em servidores seguros (Supabase/AWS), backups automáticos e seguimos as melhores práticas de segurança. Somos compatíveis com LGPD.',
  },
  {
    category: 'tecnico',
    question: 'Posso integrar com outros sistemas?',
    answer: 'Planos PREMIUM e ENTERPRISE têm acesso à API REST para integrações personalizadas. Também oferecemos integração nativa com WhatsApp (SOLO PRO+) para envio de lembretes e confirmações.',
  },
  {
    category: 'tecnico',
    question: 'Tem aplicativo mobile?',
    answer: 'Atualmente não temos app nativo, mas nosso site é totalmente responsivo e funciona perfeitamente em celulares. Você pode adicionar um atalho na tela inicial do seu celular para acesso rápido.',
  },
  
  // FUNCIONALIDADES
  {
    category: 'funcionalidades',
    question: 'Como funciona o agendamento online?',
    answer: 'Com o plano SOLO PRO ou superior, seus clientes podem agendar diretamente pelo seu link personalizado (ex: suabarbearia.barber.gold/book). Eles escolhem serviço, profissional, data e horário. Você recebe notificação e pode confirmar.',
  },
  {
    category: 'funcionalidades',
    question: 'O sistema calcula comissões automaticamente?',
    answer: 'Sim! A partir do plano SOLO PRO, você define a taxa de comissão de cada profissional (% ou valor fixo) e o sistema calcula automaticamente em cada venda. Gera relatórios detalhados por período.',
  },
  {
    category: 'funcionalidades',
    question: 'Como funciona o programa de fidelidade?',
    answer: 'No plano SOLO PRO+, você pode configurar pontos por valor gasto. Exemplo: a cada R$ 10 gastos = 1 ponto. Quando o cliente acumula X pontos, ganha um desconto ou serviço grátis. Totalmente personalizável.',
  },
  {
    category: 'funcionalidades',
    question: 'Posso enviar lembretes por WhatsApp?',
    answer: 'Sim! A partir do SOLO PRO, você pode integrar com WhatsApp Business API para enviar lembretes automáticos de agendamentos, confirmações e mensagens de aniversário para seus clientes.',
  },
  {
    category: 'funcionalidades',
    question: 'O sistema controla estoque de produtos?',
    answer: 'Sim! A partir do plano TEAM, você tem gestão completa de estoque: entrada/saída, estoque mínimo, alertas de reposição, relatórios de giro e muito mais.',
  },
  {
    category: 'funcionalidades',
    question: 'Posso ter mais de uma unidade/filial?',
    answer: 'Sim! O plano PREMIUM permite até 3 unidades e o ENTERPRISE permite unidades ilimitadas. Cada unidade tem sua própria agenda, profissionais e relatórios, mas você gerencia tudo em um só lugar.',
  },
]

const CATEGORIES = {
  geral: { name: 'Geral', icon: '📋' },
  planos: { name: 'Planos e Assinaturas', icon: '💎' },
  pagamentos: { name: 'Pagamentos', icon: '💳' },
  tecnico: { name: 'Técnico', icon: '⚙️' },
  funcionalidades: { name: 'Funcionalidades', icon: '✨' },
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const router = useRouter()
  
  // Filtrar FAQs
  const filteredFAQs = FAQ_ITEMS.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })
  
  function toggleItem(index: number) {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            ← Voltar
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 shadow-sm"
          >
            Entrar
          </button>
        </div>
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-gray-600">
            Tire todas as suas dúvidas sobre o BarberFlow
          </p>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar pergunta..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Todas
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                selectedCategory === key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
        
        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-600">
                Nenhuma pergunta encontrada. Tente outro termo de busca.
              </p>
            </div>
          ) : (
            filteredFAQs.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{CATEGORIES[item.category].icon}</span>
                    <span className="font-semibold text-gray-900 text-lg">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openItems.has(index) ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openItems.has(index) && (
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nossa equipe está pronta para ajudar!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/contact')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-xl"
            >
              Falar com Suporte
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition"
            >
              Começar Grátis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

