'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { validateSubdomain, suggestSubdomains } from '@/lib/tenant/reserved-subdomains'
import { checkSlugAvailability, registerTenantAction } from '@/modules/tenant/actions'

export default function RegisterPage() {
  const router = useRouter()
  
  // Form state
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slugError, setSlugError] = useState('')
  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Validar slug em tempo real
  useEffect(() => {
    if (!slug) {
      setSlugError('')
      setSlugAvailable(false)
      return
    }

    const timer = setTimeout(async () => {
      // Validar formato
      const validation = validateSubdomain(slug)
      if (!validation.valid) {
        setSlugError(validation.error || '')
        setSlugAvailable(false)
        return
      }

      // Verificar disponibilidade
      setSlugChecking(true)
      const result = await checkSlugAvailability(slug)
      setSlugChecking(false)

      if (!result.available) {
        setSlugError(result.error || 'Nome não disponível')
        setSlugAvailable(false)
      } else {
        setSlugError('')
        setSlugAvailable(true)
      }
    }, 500) // Debounce 500ms

    return () => clearTimeout(timer)
  }, [slug])

  // Gerar sugestões quando nome da barbearia muda
  useEffect(() => {
    if (name && !slug) {
      const newSuggestions = suggestSubdomains(name)
      setSuggestions(newSuggestions)
    }
  }, [name, slug])

  function handleSlugChange(value: string) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSlug(cleaned)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validações
    if (!slugAvailable) {
      setError('Escolha um nome disponível para sua barbearia')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      setLoading(false)
      return
    }

    // Registrar
    const result = await registerTenantAction({
      slug,
      name,
      ownerName,
      email,
      password,
    })

    if (!result.success) {
      setError(result.error || 'Erro ao criar conta')
      setLoading(false)
      return
    }

    // Redirecionar para o subdomain criado
    window.location.href = `https://${slug}.barber.gold/login?registered=true`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crie sua Barbearia Online
          </h1>
          <p className="text-gray-600">
            Escolha um endereço exclusivo para sua barbearia
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subdomain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu endereço exclusivo *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="minhabarbearia"
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                  slugError ? 'border-red-500' : slugAvailable ? 'border-green-500' : 'border-gray-300'
                }`}
                required
              />
              <span className="text-gray-600 whitespace-nowrap font-mono text-sm">
                .barber.gold
              </span>
            </div>

            {/* Status do slug */}
            {slugChecking && (
              <p className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                <span className="animate-spin">⏳</span> Verificando...
              </p>
            )}
            {slugError && !slugChecking && (
              <p className="mt-2 text-sm text-red-600">❌ {slugError}</p>
            )}
            {slugAvailable && !slugChecking && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                ✅ Disponível: {slug}.barber.gold
              </p>
            )}

            {/* Sugestões */}
            {suggestions.length > 0 && !slug && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Sugestões:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setSlug(suggestion)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nome da Barbearia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Barbearia *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Barbearia do João"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Nome do Proprietário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu Nome Completo *
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="João Silva"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
            <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Senha *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !slugAvailable || slugChecking}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? 'Criando sua barbearia...' : 'Criar minha conta grátis'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

