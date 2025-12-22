export default function TenantNotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="text-6xl">🏪</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Barbearia não encontrada
        </h1>
        
        <p className="text-gray-600 mb-8">
          Esta barbearia não existe ou está inativa.
        </p>
        
        <div className="space-y-3">
          <a
            href="https://barber.gold/register"
            className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Criar minha barbearia
          </a>
          
          <a
            href="https://barber.gold"
            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  )
}

