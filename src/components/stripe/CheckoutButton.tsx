/**
 * Botão de Checkout Stripe
 * 
 * Cria sessão de checkout e redireciona para Stripe
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckoutButtonProps {
  priceId: string
  planName: string
  className?: string
  children?: React.ReactNode
}

export function CheckoutButton({ 
  priceId, 
  planName, 
  className = '',
  children 
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  async function handleCheckout() {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar checkout')
      }
      
      if (data.url) {
        // Redirecionar para Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error('URL de checkout não retornada')
      }
      
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Erro ao processar pagamento')
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading || !priceId}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processando...
          </span>
        ) : (
          children || `Assinar ${planName}`
        )}
      </button>
      
      {error && (
        <p className="text-sm text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  )
}


