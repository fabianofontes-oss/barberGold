/**
 * Página de Pricing
 * 
 * Mostra todos os planos com comparação e CTAs
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'
import { STRIPE_PLANS, formatPrice, getAnnualDiscount } from '@/lib/stripe/products'
import { Check, X, Zap, Star } from 'lucide-react'

export default function PricingPage() {
  const [interval, setInterval] = useState<'month' | 'year'>('month')
  const router = useRouter()
  const discount = getAnnualDiscount()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2"
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
        
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planos para Todos os Tamanhos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Comece grátis e faça upgrade quando crescer. Sem compromisso, cancele quando quiser.
          </p>
          
          {/* Toggle Mensal/Anual */}
          <div className="inline-flex items-center gap-4 bg-white p-2 rounded-full shadow-lg">
            <button
              onClick={() => setInterval('month')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                interval === 'month'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setInterval('year')}
              className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                interval === 'year'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                -{discount}%
              </span>
            </button>
          </div>
        </div>
        
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {STRIPE_PLANS.map((plan) => {
            const price = interval === 'month' ? plan.priceMonthly : plan.priceYearly
            const priceId = interval === 'month' ? plan.stripePriceMonthly : plan.stripePriceYearly
            const monthlyEquivalent = interval === 'year' ? price / 12 : price
            
            return (
              <div
                key={plan.slug}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular
                    ? 'ring-4 ring-blue-500 transform scale-105'
                    : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                
                {/* Plan Name */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    {price === 0 ? (
                      <div className="text-5xl font-bold text-gray-900">Grátis</div>
                    ) : (
                      <>
                        <div className="text-5xl font-bold text-gray-900">
                          {formatPrice(monthlyEquivalent)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {interval === 'month' ? '/mês' : '/mês no plano anual'}
                        </div>
                        {interval === 'year' && (
                          <div className="text-xs text-green-600 font-semibold mt-1">
                            {formatPrice(price)}/ano (economize {formatPrice(plan.priceMonthly * 12 - price)})
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* CTA */}
                <div className="mb-6">
                  {plan.slug === 'free' ? (
                    <button
                      onClick={() => router.push('/register')}
                      className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition shadow-md"
                    >
                      {plan.cta}
                    </button>
                  ) : plan.slug === 'enterprise' ? (
                    <button
                      onClick={() => router.push('/contact')}
                      className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-md"
                    >
                      {plan.cta}
                    </button>
                  ) : priceId ? (
                    <CheckoutButton
                      priceId={priceId}
                      planName={plan.name}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
                    >
                      {plan.cta}
                    </CheckoutButton>
                  ) : (
                    <button
                      onClick={() => router.push('/register')}
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
                
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Comparação Detalhada
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Funcionalidade</th>
                  {STRIPE_PLANS.map(plan => (
                    <th key={plan.slug} className="py-4 px-4 text-center">
                      <div className="font-bold text-gray-900">{plan.name}</div>
                      <div className="text-sm text-gray-500 font-normal">
                        {plan.priceMonthly === 0 ? 'Grátis' : `${formatPrice(plan.priceMonthly)}/mês`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Profissionais', values: ['1', '1', '1', '5', '10', 'Ilimitado'] },
                  { label: 'Agendamentos/mês', values: ['30', 'Ilimitado', 'Ilimitado', 'Ilimitado', 'Ilimitado', 'Ilimitado'] },
                  { label: 'Agendamento Online', values: [false, false, true, true, true, true] },
                  { label: 'Comissões', values: [false, false, true, true, true, true] },
                  { label: 'Fidelidade', values: [false, false, true, true, true, true] },
                  { label: 'Relatórios Avançados', values: [false, false, true, true, true, true] },
                  { label: 'WhatsApp', values: [false, false, true, true, true, true] },
                  { label: 'Gestão Estoque', values: [false, false, false, true, true, true] },
                  { label: 'Multi-unidade', values: ['Não', 'Não', 'Não', 'Não', '3', 'Ilimitado'] },
                  { label: 'API Integração', values: [false, false, false, false, true, true] },
                  { label: 'White-label', values: [false, false, false, false, false, true] },
                  { label: 'Suporte', values: ['Email', 'Email', 'Prioritário', 'Prioritário', '24/7', '24/7 + Gerente'] },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.label}</td>
                    {row.values.map((value, planIdx) => (
                      <td key={planIdx} className="py-4 px-4 text-center">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* FAQ Pricing */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes sobre Planos
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Posso começar grátis?',
                a: 'Sim! O plano FREE é completamente gratuito e não requer cartão de crédito. Teste o sistema e faça upgrade quando precisar.',
              },
              {
                q: 'Como funciona o teste?',
                a: 'Você pode usar o plano FREE por tempo indeterminado. Quando quiser mais recursos, basta fazer upgrade.',
              },
              {
                q: 'Posso mudar de plano depois?',
                a: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. Mudanças são refletidas imediatamente.',
              },
              {
                q: 'Qual o desconto do plano anual?',
                a: `Planos anuais têm ${discount}% de desconto em relação ao mensal. Ou seja, você paga 10 meses e ganha 2 de graça!`,
              },
              {
                q: 'Posso cancelar quando quiser?',
                a: 'Sim! Não há fidelidade. Cancele quando quiser direto no painel de controle. Sem taxas de cancelamento.',
              },
              {
                q: 'Quais formas de pagamento aceitam?',
                a: 'Aceitamos todos os cartões de crédito principais (Visa, Mastercard, Amex, Elo). Pagamentos processados pelo Stripe.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                <summary className="font-semibold text-gray-900 text-lg">
                  {faq.q}
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
        
        {/* CTA Final */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Transformar sua Barbearia?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de barbeiros que já usam o BarberFlow
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-xl inline-flex items-center gap-2"
          >
            <Zap className="w-6 h-6" />
            Começar Grátis Agora
          </button>
          <p className="text-sm mt-4 opacity-75">
            Sem cartão de crédito • Setup em 2 minutos • Cancele quando quiser
          </p>
        </div>
      </div>
    </div>
  )
}

