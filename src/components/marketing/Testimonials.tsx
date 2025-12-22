/**
 * Componente: Depoimentos de Clientes
 * 
 * Exibe depoimentos em formato de cards com carrossel
 */

'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

export interface Testimonial {
  id: string
  name: string
  role: string
  barbershop: string
  city: string
  rating: number
  text: string
  avatar: string
  plan: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'Proprietário',
    barbershop: 'Barbearia Clássica',
    city: 'São Paulo, SP',
    rating: 5,
    text: 'O BarberFlow revolucionou minha barbearia! Antes eu perdia horas com agendas de papel e agora tudo é automático. O sistema de comissões me economiza tempo e evita erros. Recomendo demais!',
    avatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=0D8ABC&color=fff&size=200',
    plan: 'SOLO PRO',
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    role: 'Gerente',
    barbershop: 'Barber Kings',
    city: 'Rio de Janeiro, RJ',
    rating: 5,
    text: 'Com 5 profissionais, controlar comissões era um pesadelo. Agora com o BarberFlow tudo é calculado automaticamente. O agendamento online trouxe muito mais clientes. Melhor investimento que fiz!',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Mendes&background=6366F1&color=fff&size=200',
    plan: 'TEAM',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    role: 'Barbeiro',
    barbershop: 'Pedro\'s Barber',
    city: 'Belo Horizonte, MG',
    rating: 5,
    text: 'Trabalho sozinho e o plano SOLO é perfeito para mim. Interface simples, não trava, e meus clientes adoram agendar pelo link. Suporte também é rápido quando preciso. Top demais!',
    avatar: 'https://ui-avatars.com/api/?name=Pedro+Oliveira&background=8B5CF6&color=fff&size=200',
    plan: 'SOLO',
  },
  {
    id: '4',
    name: 'Ricardo Santos',
    role: 'Proprietário',
    barbershop: 'Elite Barber Shop',
    city: 'Curitiba, PR',
    rating: 5,
    text: 'Tenho 3 unidades e o BarberFlow permite gerenciar tudo em um só lugar. Relatórios por unidade, controle total de estoque, e a equipe se adaptou super rápido. Sistema profissional de verdade.',
    avatar: 'https://ui-avatars.com/api/?name=Ricardo+Santos&background=EC4899&color=fff&size=200',
    plan: 'PREMIUM',
  },
  {
    id: '5',
    name: 'Fernando Costa',
    role: 'Dono',
    barbershop: 'F.C. Barbearia',
    city: 'Porto Alegre, RS',
    rating: 5,
    text: 'Comecei no plano FREE para testar e em 1 semana já fiz upgrade. É muito bom poder ver os relatórios de faturamento, comissões e ter o programa de fidelidade. Meus clientes amam os pontos!',
    avatar: 'https://ui-avatars.com/api/?name=Fernando+Costa&background=10B981&color=fff&size=200',
    plan: 'SOLO PRO',
  },
]

interface TestimonialsProps {
  variant?: 'carousel' | 'grid'
  showPlan?: boolean
  className?: string
}

export function Testimonials({ 
  variant = 'carousel', 
  showPlan = true,
  className = '' 
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  // Auto-play carousel
  useEffect(() => {
    if (variant !== 'carousel' || !isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000) // Muda a cada 5 segundos
    
    return () => clearInterval(interval)
  }, [variant, isAutoPlaying])
  
  function handlePrevious() {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }
  
  function handleNext() {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }
  
  function handleDotClick(index: number) {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }
  
  if (variant === 'grid') {
    return (
      <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard 
            key={testimonial.id} 
            testimonial={testimonial} 
            showPlan={showPlan}
          />
        ))}
      </div>
    )
  }
  
  // Carousel
  return (
    <div className={`relative ${className}`}>
      {/* Main Card */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <TestimonialCard 
                testimonial={testimonial} 
                showPlan={showPlan}
                featured
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition z-10"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition z-10"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
      
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentIndex 
                ? 'bg-blue-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function TestimonialCard({ 
  testimonial, 
  showPlan,
  featured = false 
}: { 
  testimonial: Testimonial
  showPlan: boolean
  featured?: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${featured ? 'max-w-3xl mx-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
          <p className="text-sm text-gray-600">
            {testimonial.role} - {testimonial.barbershop}
          </p>
          <p className="text-xs text-gray-500">{testimonial.city}</p>
        </div>
        {showPlan && (
          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-full">
            {testimonial.plan}
          </span>
        )}
      </div>
      
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      {/* Testimonial Text */}
      <p className="text-gray-700 leading-relaxed italic">
        "{testimonial.text}"
      </p>
    </div>
  )
}

