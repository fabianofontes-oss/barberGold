/**
 * Componente: Feature Bloqueada
 * 
 * Exibe mensagem e CTA quando feature está bloqueada
 */

'use client'

import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FeatureLockedProps {
  featureName: string
  description?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FeatureLocked({
  featureName,
  description,
  className = '',
  size = 'md',
}: FeatureLockedProps) {
  const router = useRouter()
  
  const sizes = {
    sm: {
      container: 'p-4',
      icon: 'w-8 h-8',
      iconContainer: 'w-12 h-12',
      title: 'text-sm',
      description: 'text-xs',
      button: 'px-3 py-1.5 text-xs',
    },
    md: {
      container: 'p-6',
      icon: 'w-10 h-10',
      iconContainer: 'w-16 h-16',
      title: 'text-base',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm',
    },
    lg: {
      container: 'p-8',
      icon: 'w-12 h-12',
      iconContainer: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-base',
      button: 'px-6 py-3 text-base',
    },
  }
  
  const s = sizes[size]
  
  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl ${s.container} ${className}`}>
      <div className="flex flex-col items-center text-center">
        {/* Lock Icon */}
        <div className={`${s.iconContainer} rounded-full bg-gray-200 flex items-center justify-center mb-4`}>
          <Lock className={`${s.icon} text-gray-500`} />
        </div>
        
        {/* Title */}
        <h3 className={`font-bold text-gray-900 mb-2 ${s.title}`}>
          {featureName}
        </h3>
        
        {/* Description */}
        {description && (
          <p className={`text-gray-600 mb-4 ${s.description}`}>
            {description}
          </p>
        )}
        
        {/* CTA */}
        <button
          onClick={() => router.push('/pricing')}
          className={`${s.button} bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg`}
        >
          🚀 Fazer Upgrade
        </button>
        
        {/* Small text */}
        <p className="text-xs text-gray-500 mt-3">
          Disponível a partir do plano SOLO PRO
        </p>
      </div>
    </div>
  )
}


