/**
 * Dados de Exemplo para Demo/Onboarding
 * 
 * Seed data realista para popular conta nova
 */

import { createClient } from '@/lib/supabase/server'

/**
 * Clientes fictícios brasileiros
 */
export const DEMO_CLIENTS = [
  {
    name: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'joao.silva@email.com',
    cpf: '123.456.789-00',
    birth_date: '1985-03-15',
    notes: 'Cliente VIP. Prefere cortes clássicos.',
  },
  {
    name: 'Maria Santos',
    phone: '(11) 97654-3210',
    email: 'maria.santos@email.com',
    cpf: '234.567.890-11',
    birth_date: '1990-07-22',
    notes: 'Vem sempre aos sábados pela manhã.',
  },
  {
    name: 'Pedro Oliveira',
    phone: '(11) 96543-2109',
    email: 'pedro.oliveira@email.com',
    cpf: '345.678.901-22',
    birth_date: '1988-11-30',
    notes: 'Gosta de cortes modernos e degradê.',
  },
  {
    name: 'Ana Costa',
    phone: '(11) 95432-1098',
    email: 'ana.costa@email.com',
    birth_date: '1995-05-18',
    notes: 'Cliente nova. Indicada por Maria.',
  },
  {
    name: 'Carlos Ferreira',
    phone: '(11) 94321-0987',
    email: 'carlos.ferreira@email.com',
    cpf: '456.789.012-33',
    birth_date: '1982-09-25',
    notes: 'Empresário. Sempre pontual.',
  },
  {
    name: 'Juliana Lima',
    phone: '(11) 93210-9876',
    email: 'juliana.lima@email.com',
    birth_date: '1992-12-10',
    notes: null,
  },
  {
    name: 'Roberto Alves',
    phone: '(11) 92109-8765',
    email: 'roberto.alves@email.com',
    cpf: '567.890.123-44',
    birth_date: '1978-04-05',
    notes: 'Aposentado. Vem toda segunda-feira.',
  },
  {
    name: 'Fernanda Souza',
    phone: '(11) 91098-7654',
    email: 'fernanda.souza@email.com',
    birth_date: '1998-08-14',
    notes: 'Estudante. Gosta de conversar.',
  },
  {
    name: 'Ricardo Mendes',
    phone: '(11) 90987-6543',
    email: 'ricardo.mendes@email.com',
    cpf: '678.901.234-55',
    birth_date: '1987-02-28',
    notes: 'Trabalha perto. Vem no horário de almoço.',
  },
  {
    name: 'Camila Rodrigues',
    phone: '(11) 89876-5432',
    email: 'camila.rodrigues@email.com',
    birth_date: '1993-06-20',
    notes: 'Cliente fiel há 2 anos.',
  },
]

/**
 * Serviços padrão de barbearia
 */
export const DEMO_SERVICES = [
  {
    name: 'Corte Masculino',
    description: 'Corte de cabelo masculino tradicional',
    duration: 30,
    price: 45.00,
    category: 'CORTE',
  },
  {
    name: 'Corte + Barba',
    description: 'Corte de cabelo + barba completa',
    duration: 45,
    price: 65.00,
    category: 'COMBO',
  },
  {
    name: 'Barba',
    description: 'Barba completa com toalha quente',
    duration: 20,
    price: 30.00,
    category: 'BARBA',
  },
  {
    name: 'Degradê',
    description: 'Degradê moderno com máquina',
    duration: 40,
    price: 55.00,
    category: 'CORTE',
  },
  {
    name: 'Sobrancelha',
    description: 'Design de sobrancelha',
    duration: 15,
    price: 20.00,
    category: 'ESTETICA',
  },
  {
    name: 'Corte Infantil',
    description: 'Corte para crianças até 12 anos',
    duration: 25,
    price: 35.00,
    category: 'CORTE',
  },
  {
    name: 'Hidratação',
    description: 'Hidratação capilar profunda',
    duration: 30,
    price: 40.00,
    category: 'TRATAMENTO',
  },
  {
    name: 'Platinado',
    description: 'Descoloração completa',
    duration: 120,
    price: 150.00,
    category: 'COLORACAO',
  },
]

/**
 * Produtos para venda
 */
export const DEMO_PRODUCTS = [
  {
    name: 'Pomada Modeladora',
    description: 'Pomada para modelar cabelo, fixação forte',
    price: 35.00,
    cost: 18.00,
    stock: 15,
    min_stock: 5,
    category: 'FINALIZACAO',
    barcode: '7891234567890',
  },
  {
    name: 'Shampoo Anticaspa',
    description: 'Shampoo para tratamento de caspa',
    price: 28.00,
    cost: 14.00,
    stock: 20,
    min_stock: 8,
    category: 'HIGIENE',
    barcode: '7891234567891',
  },
  {
    name: 'Cera Modeladora',
    description: 'Cera para finalização, efeito natural',
    price: 32.00,
    cost: 16.00,
    stock: 12,
    min_stock: 5,
    category: 'FINALIZACAO',
    barcode: '7891234567892',
  },
]

/**
 * Gera agendamentos dos últimos 7 dias
 */
export function generateDemoAppointments(
  tenantId: string,
  clientIds: string[],
  serviceIds: string[],
  staffId: string
) {
  const appointments = []
  const now = new Date()
  
  // Últimos 7 dias
  for (let daysAgo = 7; daysAgo >= 0; daysAgo--) {
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    
    // 3-5 agendamentos por dia
    const count = Math.floor(Math.random() * 3) + 3
    
    for (let i = 0; i < count; i++) {
      const hour = 9 + Math.floor(Math.random() * 9) // 9h às 18h
      const minute = [0, 30][Math.floor(Math.random() * 2)]
      
      const appointmentDate = new Date(date)
      appointmentDate.setHours(hour, minute, 0, 0)
      
      // Status baseado na data
      let status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' = 'COMPLETED'
      if (daysAgo === 0) {
        status = ['SCHEDULED', 'CONFIRMED'][Math.floor(Math.random() * 2)] as any
      } else if (Math.random() < 0.1) {
        status = 'CANCELLED'
      }
      
      appointments.push({
        tenant_id: tenantId,
        client_id: clientIds[Math.floor(Math.random() * clientIds.length)],
        service_id: serviceIds[Math.floor(Math.random() * serviceIds.length)],
        staff_id: staffId,
        date: appointmentDate.toISOString().split('T')[0],
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        status,
        notes: Math.random() < 0.3 ? 'Cliente pediu para fazer rápido' : null,
      })
    }
  }
  
  return appointments
}

/**
 * Gera vendas dos últimos 30 dias
 */
export function generateDemoSales(
  tenantId: string,
  clientIds: string[],
  serviceIds: string[],
  productIds: string[],
  staffId: string
) {
  const sales = []
  const now = new Date()
  
  // Últimos 30 dias
  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    
    // 1-3 vendas por dia
    const count = Math.floor(Math.random() * 3) + 1
    
    for (let i = 0; i < count; i++) {
      const hasClient = Math.random() < 0.8 // 80% tem cliente
      const paymentMethod = ['CASH', 'DEBIT', 'CREDIT', 'PIX'][Math.floor(Math.random() * 4)]
      
      sales.push({
        tenant_id: tenantId,
        client_id: hasClient ? clientIds[Math.floor(Math.random() * clientIds.length)] : null,
        staff_id: staffId,
        payment_method: paymentMethod,
        status: 'COMPLETED',
        created_at: date.toISOString(),
      })
    }
  }
  
  return sales
}

/**
 * Popula conta com dados de exemplo
 */
export async function seedDemoData(tenantId: string, userId: string) {
  try {
    const supabase = await createClient()
    
    console.log('[Seed] Iniciando seed de dados para tenant:', tenantId)
    
    // 1. Criar clientes
    console.log('[Seed] Criando clientes...')
    const clientsToInsert = DEMO_CLIENTS.map(c => ({
      ...c,
      tenant_id: tenantId,
    }))
    
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .insert(clientsToInsert)
      .select('id')
    
    if (clientsError) throw clientsError
    const clientIds = clients?.map(c => c.id) || []
    console.log(`[Seed] ${clientIds.length} clientes criados`)
    
    // 2. Criar serviços
    console.log('[Seed] Criando serviços...')
    const servicesToInsert = DEMO_SERVICES.map(s => ({
      ...s,
      tenant_id: tenantId,
    }))
    
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .insert(servicesToInsert)
      .select('id')
    
    if (servicesError) throw servicesError
    const serviceIds = services?.map(s => s.id) || []
    console.log(`[Seed] ${serviceIds.length} serviços criados`)
    
    // 3. Criar produtos
    console.log('[Seed] Criando produtos...')
    const productsToInsert = DEMO_PRODUCTS.map(p => ({
      ...p,
      tenant_id: tenantId,
    }))
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select('id')
    
    if (productsError) throw productsError
    const productIds = products?.map(p => p.id) || []
    console.log(`[Seed] ${productIds.length} produtos criados`)
    
    // 4. Buscar staff_id (o próprio usuário)
    const { data: staff } = await supabase
      .from('staff')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .single()
    
    const staffId = staff?.id
    
    if (staffId) {
      // 5. Criar agendamentos
      console.log('[Seed] Criando agendamentos...')
      const appointments = generateDemoAppointments(tenantId, clientIds, serviceIds, staffId)
      
      const { error: appointmentsError } = await supabase
        .from('appointments')
        .insert(appointments)
      
      if (appointmentsError) throw appointmentsError
      console.log(`[Seed] ${appointments.length} agendamentos criados`)
      
      // 6. Criar vendas
      console.log('[Seed] Criando vendas...')
      const sales = generateDemoSales(tenantId, clientIds, serviceIds, productIds, staffId)
      
      for (const sale of sales) {
        // Criar venda
        const { data: saleData, error: saleError } = await supabase
          .from('sales')
          .insert({
            ...sale,
            total_amount: 0, // Será calculado depois
            discount: 0,
          })
          .select('id')
          .single()
        
        if (saleError) continue
        
        // Adicionar 1-2 items na venda
        const itemCount = Math.floor(Math.random() * 2) + 1
        let total = 0
        
        for (let i = 0; i < itemCount; i++) {
          const isService = Math.random() < 0.8 // 80% serviço, 20% produto
          
          if (isService && serviceIds.length > 0) {
            const serviceId = serviceIds[Math.floor(Math.random() * serviceIds.length)]
            const { data: service } = await supabase
              .from('services')
              .select('price')
              .eq('id', serviceId)
              .single()
            
            if (service) {
              await supabase.from('sale_items').insert({
                sale_id: saleData.id,
                service_id: serviceId,
                item_type: 'SERVICE',
                quantity: 1,
                unit_price: service.price,
                subtotal: service.price,
              })
              total += service.price
            }
          } else if (productIds.length > 0) {
            const productId = productIds[Math.floor(Math.random() * productIds.length)]
            const { data: product } = await supabase
              .from('products')
              .select('price')
              .eq('id', productId)
              .single()
            
            if (product) {
              const quantity = Math.floor(Math.random() * 2) + 1
              await supabase.from('sale_items').insert({
                sale_id: saleData.id,
                product_id: productId,
                item_type: 'PRODUCT',
                quantity,
                unit_price: product.price,
                subtotal: product.price * quantity,
              })
              total += product.price * quantity
            }
          }
        }
        
        // Atualizar total da venda
        await supabase
          .from('sales')
          .update({ total_amount: total })
          .eq('id', saleData.id)
      }
      
      console.log(`[Seed] ${sales.length} vendas criadas`)
    }
    
    console.log('[Seed] ✅ Seed completo!')
    
    return { success: true }
    
  } catch (error: any) {
    console.error('[Seed] Erro:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Verifica se já tem dados (para não duplicar)
 */
export async function hasDemoData(tenantId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    
    const { count } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
    
    return (count || 0) > 0
    
  } catch {
    return false
  }
}


