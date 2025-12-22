/**
 * Modal de Upgrade
 * 
 * Mostra quando usuário tenta usar feature bloqueada
 */

'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  reason: string
  currentPlan?: string
  recommendedPlan?: string
}

export function UpgradeModal({
  isOpen,
  onClose,
  feature,
  reason,
  currentPlan = 'free',
  recommendedPlan = 'solo-pro',
}: UpgradeModalProps) {
  const router = useRouter()
  
  if (!isOpen) return null
  
  function handleUpgrade() {
    router.push('/pricing')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Upgrade Necessário
        </h2>
        
        {/* Feature */}
        <p className="text-center text-gray-600 mb-4">
          <span className="font-semibold text-gray-900">{feature}</span> não está disponível no plano {currentPlan.toUpperCase()}.
        </p>
        
        {/* Reason */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            {reason}
          </p>
        </div>
        
        {/* Benefits */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Com o upgrade você terá acesso a:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Agendamentos ilimitados</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Sistema de comissões automático</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Agendamento online para clientes</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Relatórios avançados e muito mais!</span>
            </li>
          </ul>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Voltar
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
          >
            Ver Planos
          </button>
        </div>
        
        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-4">
          Sem compromisso. Cancele quando quiser.
        </p>
      </div>
    </div>
  )
}

