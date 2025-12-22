/**
 * Página: Sobre Nós
 */

'use client'

import { useRouter } from 'next/navigation'
import { Target, Heart, Zap, Users } from 'lucide-react'

export default function AboutPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            ← Voltar
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 shadow-sm"
          >
            Entrar
          </button>
        </div>
        
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre o BarberGold
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transformando a gestão de barbearias com tecnologia moderna e simplicidade
          </p>
        </div>
        
        {/* Story */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              O BarberGold nasceu da necessidade real de barbeiros que lutavam diariamente com agendas de papel, 
              planilhas confusas e a dificuldade de controlar comissões e fidelidade de clientes.
            </p>
            <p>
              Percebemos que a maioria dos sistemas disponíveis eram complexos demais, caros ou não atendiam 
              as necessidades específicas de barbearias brasileiras. Então decidimos criar algo diferente.
            </p>
            <p>
              Desenvolvemos uma plataforma moderna, intuitiva e acessível, feita especialmente para barbeiros 
              que querem focar no que fazem de melhor: atender bem seus clientes.
            </p>
            <p className="font-semibold text-gray-900">
              Hoje, ajudamos centenas de barbearias a crescerem e se profissionalizarem, 
              economizando tempo e aumentando lucros.
            </p>
          </div>
        </div>
        
        {/* Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Missão</h3>
            <p className="text-gray-700 leading-relaxed">
              Simplificar a gestão de barbearias através de tecnologia acessível, 
              permitindo que profissionais foquem em seu trabalho e cresçam seus negócios.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Valores</h3>
            <p className="text-gray-700 leading-relaxed">
              Simplicidade, transparência e foco no cliente. Acreditamos que tecnologia 
              deve facilitar, não complicar. Por isso criamos um sistema intuitivo e honesto.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Inovação</h3>
            <p className="text-gray-700 leading-relaxed">
              Estamos sempre evoluindo. Ouvimos nossos clientes e implementamos melhorias 
              constantemente para oferecer a melhor experiência possível.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Comunidade</h3>
            <p className="text-gray-700 leading-relaxed">
              Mais que um software, somos uma comunidade de barbeiros que se ajudam. 
              Compartilhamos conhecimento e crescemos juntos.
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white mb-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Barbearias Ativas</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50k+</div>
              <div className="text-xl opacity-90">Agendamentos/Mês</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-xl opacity-90">Satisfação</div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a centenas de barbeiros que já transformaram seus negócios
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-xl"
          >
            Começar Grátis Agora
          </button>
        </div>
      </div>
    </div>
  )
}

