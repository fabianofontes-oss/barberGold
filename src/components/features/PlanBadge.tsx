/**
 * Badge do Plano Atual
 * 
 * Mostra o plano do usuário com estilo bonito
 */

'use client'

interface PlanBadgeProps {
  planSlug: string
  className?: string
  showUpgrade?: boolean
  onUpgradeClick?: () => void
}

export function PlanBadge({
  planSlug,
  className = '',
  showUpgrade = false,
  onUpgradeClick,
}: PlanBadgeProps) {
  const planStyles: Record<string, { bg: string; text: string; ring: string; label: string }> = {
    free: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      ring: 'ring-gray-300',
      label: 'FREE',
    },
    solo: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      ring: 'ring-blue-300',
      label: 'SOLO',
    },
    'solo-pro': {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      ring: 'ring-indigo-300',
      label: 'SOLO PRO',
    },
    team: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      ring: 'ring-purple-300',
      label: 'TEAM',
    },
    premium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      ring: 'ring-yellow-300',
      label: 'PREMIUM',
    },
    enterprise: {
      bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      text: 'text-white',
      ring: 'ring-purple-400',
      label: 'ENTERPRISE',
    },
  }
  
  const style = planStyles[planSlug] || planStyles.free
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ring-2 ${style.bg} ${style.text} ${style.ring}`}
      >
        {planSlug === 'enterprise' && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {style.label}
      </span>
      
      {showUpgrade && planSlug !== 'enterprise' && (
        <button
          onClick={onUpgradeClick}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
        >
          Upgrade
        </button>
      )}
    </div>
  )
}

