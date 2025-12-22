/**
 * Página de Erro Global
 * 
 * Captura erros não tratados
 */

'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ops! Algo deu errado
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Encontramos um erro inesperado ao processar sua solicitação.
          Nossa equipe foi notificada automaticamente.
        </p>

        {/* Error Code (if available) */}
        {error.digest && (
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Código do Erro:</p>
            <p className="text-sm font-mono text-gray-700">{error.digest}</p>
          </div>
        )}

        {/* Error Message (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-xs font-semibold text-red-900 mb-2">Debug Info:</p>
            <p className="text-xs font-mono text-red-700 break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </button>
        </div>

        {/* Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Problema persistindo?{' '}
            <a href="/contact" className="text-blue-600 hover:underline font-semibold">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

