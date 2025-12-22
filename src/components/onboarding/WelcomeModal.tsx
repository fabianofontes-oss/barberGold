/**
 * Modal de Boas-Vindas
 * 
 * Mostra após primeiro login com opção de popular dados de exemplo
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { seedDemoDataAction } from '@/modules/demo/actions'
import { Sparkles, X, CheckCircle2 } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

export function WelcomeModal({ isOpen, onClose, userName = 'Barbeiro' }: WelcomeModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  if (!isOpen) return null
  
  async function handleSeedData() {
    setLoading(true)
    setError('')
    
    const result = await seedDemoDataAction()
    
    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.refresh()
        onClose()
      }, 2000)
    } else {
      setError(result.error || 'Erro ao popular dados')
    }
    
    setLoading(false)
  }
  
  function handleSkip() {
    onClose()
  }
  
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dados Adicionados!
          </h2>
          
          <p className="text-gray-600">
            Sua conta foi populada com dados de exemplo. Explore o sistema!
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao BarberGold, {userName}! 🎉
          </h1>
          
          <p className="text-lg text-gray-600">
            Sua conta está pronta. Vamos começar?
          </p>
        </div>
        
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Option 1: Dados de Exemplo */}
          <div className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Explorar com Dados de Exemplo
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Popule sua conta com dados fictícios para testar o sistema
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>10 clientes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>8 serviços</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>20+ agendamentos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>15+ vendas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>3 produtos</span>
              </div>
            </div>
            
            <button
              onClick={handleSeedData}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition shadow-md"
            >
              {loading ? 'Populando...' : 'Popular com Dados de Exemplo'}
            </button>
          </div>
          
          {/* Option 2: Começar do Zero */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 transition">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Começar do Zero
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure sua barbearia do seu jeito, adicionando seus próprios dados
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Adicione seus clientes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Configure seus serviços</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Personalize tudo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Sem dados fictícios</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Controle total</span>
              </div>
            </div>
            
            <button
              onClick={handleSkip}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Começar do Zero
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Você pode sempre adicionar ou remover dados depois nas configurações
          </p>
        </div>
      </div>
    </div>
  )
}

