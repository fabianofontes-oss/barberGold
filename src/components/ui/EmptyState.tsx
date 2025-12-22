/**
 * Empty States
 * 
 * Componentes para estados vazios com call-to-action
 */

'use client'

import { Users, Calendar, ShoppingBag, FileText, Inbox, Search, Plus } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        {icon || <Inbox className="w-12 h-12 text-gray-400" />}
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      
      {/* Description */}
      <p className="text-gray-600 max-w-md mb-8">{description}</p>
      
      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {action.label}
            </button>
          )}
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Variações específicas para cada módulo

export function EmptyClients({ onAddClient }: { onAddClient?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="w-12 h-12 text-blue-500" />}
      title="Nenhum cliente cadastrado"
      description="Comece adicionando seus primeiros clientes para gerenciar agendamentos e histórico de atendimentos."
      action={onAddClient ? {
        label: 'Adicionar Primeiro Cliente',
        onClick: onAddClient,
      } : undefined}
      secondaryAction={{
        label: 'Importar Clientes',
        onClick: () => console.log('Import clients'),
      }}
    />
  )
}

export function EmptyAppointments({ onAddAppointment }: { onAddAppointment?: () => void }) {
  return (
    <EmptyState
      icon={<Calendar className="w-12 h-12 text-indigo-500" />}
      title="Nenhum agendamento"
      description="Sua agenda está vazia. Adicione o primeiro agendamento para começar a organizar seus atendimentos."
      action={onAddAppointment ? {
        label: 'Criar Agendamento',
        onClick: onAddAppointment,
      } : undefined}
    />
  )
}

export function EmptySales({ onAddSale }: { onAddSale?: () => void }) {
  return (
    <EmptyState
      icon={<ShoppingBag className="w-12 h-12 text-green-500" />}
      title="Nenhuma venda registrada"
      description="Comece a registrar suas vendas para acompanhar faturamento, comissões e controle financeiro."
      action={onAddSale ? {
        label: 'Registrar Primeira Venda',
        onClick: onAddSale,
      } : undefined}
    />
  )
}

export function EmptyReports() {
  return (
    <EmptyState
      icon={<FileText className="w-12 h-12 text-purple-500" />}
      title="Sem dados para relatórios"
      description="Você precisa ter vendas e agendamentos registrados para gerar relatórios. Comece usando o sistema!"
    />
  )
}

export function EmptySearch({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      icon={<Search className="w-12 h-12 text-gray-400" />}
      title="Nenhum resultado encontrado"
      description={`Não encontramos resultados para "${searchTerm}". Tente outro termo de busca.`}
    />
  )
}

export function EmptyData({ 
  title = "Nenhum dado disponível",
  description = "Não há informações para exibir no momento."
}: {
  title?: string
  description?: string
}) {
  return (
    <EmptyState
      icon={<Inbox className="w-12 h-12 text-gray-400" />}
      title={title}
      description={description}
    />
  )
}

