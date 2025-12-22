/**
 * Tour Guiado - Sistema de Onboarding
 * 
 * Guia interativo para novos usuários
 */

'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'

export interface TourStep {
  id: string
  title: string
  description: string
  target?: string // Seletor CSS do elemento alvo
  position?: 'top' | 'bottom' | 'left' | 'right'
  action?: {
    label: string
    onClick: () => void
  }
}

export interface Tour {
  id: string
  name: string
  steps: TourStep[]
}

interface TourGuideProps {
  tour: Tour
  isActive: boolean
  onComplete: () => void
  onSkip: () => void
}

export function TourGuide({ tour, isActive, onComplete, onSkip }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  
  const step = tour.steps[currentStep]
  const isLastStep = currentStep === tour.steps.length - 1
  const progress = ((currentStep + 1) / tour.steps.length) * 100
  
  useEffect(() => {
    if (!isActive || !step.target) return
    
    const element = document.querySelector(step.target)
    if (element) {
      const rect = element.getBoundingClientRect()
      setTargetRect(rect)
      
      // Scroll suave para o elemento
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentStep, isActive, step.target])
  
  if (!isActive) return null
  
  function handleNext() {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  function handlePrevious() {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  // Calcular posição do tooltip
  const getTooltipPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    
    const padding = 16
    const position = step.position || 'bottom'
    
    switch (position) {
      case 'top':
        return {
          top: `${targetRect.top - padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translate(-50%, -100%)',
        }
      case 'bottom':
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translate(-50%, 0)',
        }
      case 'left':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.left - padding}px`,
          transform: 'translate(-100%, -50%)',
        }
      case 'right':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.right + padding}px`,
          transform: 'translate(0, -50%)',
        }
    }
  }
  
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" />
      
      {/* Highlight */}
      {targetRect && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
          }}
        />
      )}
      
      {/* Tooltip */}
      <div
        className="fixed z-[10000] bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
        style={targetRect ? getTooltipPosition() : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-blue-600">
                  Passo {currentStep + 1} de {tour.steps.length}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
            </div>
            <button
              onClick={onSkip}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <p className="text-gray-600 leading-relaxed">{step.description}</p>
          
          {step.action && (
            <button
              onClick={step.action.onClick}
              className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition"
            >
              {step.action.label}
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Anterior</span>
          </button>
          
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Pular tour
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
          >
            <span>{isLastStep ? 'Concluir' : 'Próximo'}</span>
            {isLastStep ? (
              <Check className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}

/**
 * Hook para gerenciar tours
 */
export function useTour(tourId: string) {
  const [isActive, setIsActive] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  
  useEffect(() => {
    // Verificar se tour já foi completado
    const completed = localStorage.getItem(`tour-${tourId}-completed`)
    setHasCompleted(completed === 'true')
  }, [tourId])
  
  function startTour() {
    setIsActive(true)
  }
  
  function completeTour() {
    setIsActive(false)
    setHasCompleted(true)
    localStorage.setItem(`tour-${tourId}-completed`, 'true')
  }
  
  function skipTour() {
    setIsActive(false)
    setHasCompleted(true)
    localStorage.setItem(`tour-${tourId}-completed`, 'true')
  }
  
  function resetTour() {
    setHasCompleted(false)
    localStorage.removeItem(`tour-${tourId}-completed`)
  }
  
  return {
    isActive,
    hasCompleted,
    startTour,
    completeTour,
    skipTour,
    resetTour,
  }
}

