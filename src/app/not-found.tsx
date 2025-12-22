/**
 * Página 404 - Not Found
 */

'use client'

import { useRouter } from 'next/navigation'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            404
          </h1>
        </div>
        
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Página Não Encontrada
        </h2>
        
        {/* Description */}
        <p className="text-xl text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ir para Início
          </button>
        </div>
        
        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Páginas mais acessadas:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/login" className="text-sm text-blue-600 hover:underline font-semibold">
              Login
            </a>
            <a href="/register" className="text-sm text-blue-600 hover:underline font-semibold">
              Criar Conta
            </a>
            <a href="/pricing" className="text-sm text-blue-600 hover:underline font-semibold">
              Planos
            </a>
            <a href="/faq" className="text-sm text-blue-600 hover:underline font-semibold">
              FAQ
            </a>
            <a href="/contact" className="text-sm text-blue-600 hover:underline font-semibold">
              Contato
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

