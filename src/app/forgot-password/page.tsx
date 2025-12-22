/**
 * Página: Esqueci Minha Senha
 * 
 * Solicita reset de senha via email
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestPasswordResetAction } from '@/modules/auth/actions'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    const result = await requestPasswordResetAction(email)
    
    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || 'Erro ao enviar email')
    }
    
    setLoading(false)
  }
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Email Enviado!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Enviamos um link de recuperação para <strong>{email}</strong>.
            Verifique sua caixa de entrada e spam.
          </p>
          
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Esqueceu sua Senha?
          </h1>
          <p className="text-gray-600">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>
        
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition shadow-lg"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Voltar ao Login
          </button>
        </div>
      </div>
    </div>
  )
}

