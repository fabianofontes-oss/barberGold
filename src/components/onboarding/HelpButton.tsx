/**
 * Botão de Ajuda Flutuante
 * 
 * Permite acessar tours e ajuda a qualquer momento
 */

'use client'

import { useState } from 'react'
import { HelpCircle, BookOpen, X, Play } from 'lucide-react'

interface HelpOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  onSelect: () => void
}

interface HelpButtonProps {
  tours: HelpOption[]
  className?: string
}

export function HelpButton({ tours, className = '' }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center ${className}`}
        title="Ajuda e Tours"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <HelpCircle className="w-6 h-6" />
        )}
      </button>
      
      {/* Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6" />
                <h3 className="text-lg font-bold">Central de Ajuda</h3>
              </div>
              <p className="text-sm text-blue-100">
                Escolha um tour para aprender a usar o sistema
              </p>
            </div>
            
            {/* Tours List */}
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {tours.map((tour) => (
                <button
                  key={tour.id}
                  onClick={() => {
                    tour.onSelect()
                    setIsOpen(false)
                  }}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition">
                      {tour.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        {tour.title}
                        <Play className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {tour.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Precisa de mais ajuda?{' '}
                <a href="/faq" className="text-blue-600 hover:underline font-semibold">
                  Ver FAQ
                </a>
                {' '}ou{' '}
                <a href="/contact" className="text-blue-600 hover:underline font-semibold">
                  Falar com Suporte
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}

