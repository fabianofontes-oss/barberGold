# 💈 BarberFlow - System Blueprint & Technical Documentation

**BarberFlow (Premium Gold Edition)** é um SaaS Premium de gestão para barbearias, focado em alta performance, UX móvel e inteligência financeira.

Este documento serve como o mapa arquitetural e de regras de negócio do sistema.

---

## 🛠 Tech Stack

*   **Core:** Next.js 16 + React 19 + TypeScript
*   **Estilização:** Tailwind CSS 4 (Theme: **Premium Gold** - `Zinc-950` + `Amber-500`)
*   **Estado Global:** Context API (`BarberContext`) + localStorage para persistência.
*   **Backend:** Supabase (Auth, Database, Realtime, Storage)
*   **Datas:** `date-fns` (Manipulação robusta de fusos e intervalos).
*   **Ícones:** Lucide React.
*   **Gráficos:** Recharts.
*   **Deploy:** Vercel

---

## 📂 Arquitetura de Pastas (Domain-Driven)

O projeto segue uma estrutura modular baseada em funcionalidades, não em tipos de arquivo.

```
src/
├── app/              # Next.js App Router
├── lib/              # Configurações (Supabase, utils)
│   └── supabase/     # Cliente Supabase (client, server, middleware)
├── context/          # O "Cérebro" (BarberContext). Estado global e Actions.
├── modules/          # Funcionalidades isoladas
│   ├── agenda/       # Calendário, Agendamento e Fila de Espera
│   ├── pdv/          # Ponto de Venda, Carrinho e Checkout
│   ├── clients/      # CRM, Histórico e Fidelidade
│   ├── finance/      # Gestão Financeira, Despesas e Comissões
│   ├── catalog/      # Gestão de Serviços, Produtos e Estoque
│   ├── online-booking/ # Wizard de Autoatendimento do Cliente
│   ├── settings/     # Configurações da Loja e Equipe
│   ├── super-admin/  # Painel de Administração SaaS
│   ├── office-v2/    # Nova versão do painel admin
│   └── website/      # Site público e landing page
├── components/       # UI Components genéricos (Sidebar, Layout)
├── hooks/            # Lógica extraída (ex: useDashboardStats)
├── types.ts          # Definições de Tipos Globais (Contrato de Dados)
└── constants.ts      # Dados mockados e configurações
```

---

## 🧠 Regras de Negócio & Lógica (O "Core")

### 1. Sistema de Fila Inteligente (Walk-in Queue)
Local: `modules/agenda/components/QueuePanel.tsx`

O sistema gerencia clientes sem hora marcada (Walk-ins) usando um algoritmo configurável pelo dono.

*   **Configuração (`QueueDistributionRule`):**
    1.  **FAIRNESS (Rodízio):** Prioriza o barbeiro que atendeu *menos* hoje. Equilibra a grana da equipe.
    2.  **SPEED (Velocidade):** Prioriza quem vai desocupar *primeiro*. Minimiza a espera do cliente.
    3.  **MANUAL:** O recepcionista escolhe manualmente.
*   **Cálculo de Tempo de Espera:**
    *   Soma: (Tempo restante do corte atual) + (Duração dos cortes de quem já está na fila para aquele barbeiro).
*   **Feature "Switch to Fastest":** Se o cliente escolheu um barbeiro específico, mas a espera está alta, o sistema sugere trocar para outro disponível mais cedo (se a regra permitir).

### 2. Financeiro & Comissões
Local: `modules/finance/Finance.tsx` e `context/BarberContext.tsx`

As comissões são calculadas no momento da venda (Snapshot), não dinamicamente, para preservar o histórico se as taxas mudarem.

*   **Modelos de Compensação:**
    *   `PERCENTAGE`: Split clássico (ex: 50/50).
    *   `CHAIR_RENTAL`: Barbeiro paga aluguel fixo e fica com 100% do serviço.
*   **Regra de Desconto (`DiscountAllocation`):**
    *   `SHARED`: O desconto é aplicado no preço total, e a comissão é calculada sobre o *líquido* (Barbeiro e Loja dividem o prejuízo).
    *   `SHOP_ABSORBS`: A comissão é calculada sobre o preço *cheio*. A loja absorve todo o custo do desconto.
*   **Trava de Segurança (Safety Valve):** O dono não consegue registrar um pagamento (`Payout`) maior que o saldo líquido (`NetPayable`) acumulado do barbeiro.

### 3. Gestão de Estoque Híbrido
Local: `modules/catalog/Catalog.tsx`

O sistema diferencia dois tipos de itens:
1.  **Retail Products (Venda):** Pomadas, Shampoos vendidos no PDV. Deduz estoque ao finalizar venda.
2.  **Inventory/Backbar (Consumo Interno):** Golas, Lâminas, Galões de Shampoo.
    *   Não aparecem no PDV.
    *   São consumidos via botão "Consume" ou "Quick Add".
    *   Geram histórico de custo para cálculo de lucro real da barbearia.

### 4. Fidelidade & Gamificação
Local: `modules/clients/Clients.tsx`

*   **Lógica de Cartão:** 1 visita = 1 selo. 10 selos = Recompensa (Destaque no PDV).
*   **Fidelidade de Profissional (`fidelityThreshold`):**
    *   Se o cliente cortar `X` vezes seguidas (configurável, padrão 2) com o mesmo barbeiro, ele se torna "Loyal" àquele staff.
    *   Se cortar com outro, a sequência quebra.
*   **Ranks (Staff View):** Gamificação para motivar a equipe a reter clientes (Bronze, Silver, Gold, Diamond).

### 5. Controle de Caixa (Blindagem)
Local: `modules/finance/components/RegisterClosureModal.tsx`

*   **Fechamento Cego:** O barbeiro informa quanto contou na gaveta *antes* de ver quanto o sistema espera.
*   **Reconciliação:** O sistema calcula a diferença (Sobras ou Quebras) e registra para auditoria.

### 6. Gestão de Ritmo (Smart Breaks)
Local: `modules/settings/modals/StaffModal.tsx` e `types.ts`

*   **Configuração Individual:** Cada barbeiro define seu ritmo (ex: a cada 3 clientes, 15 min de pausa).
*   **Objetivo:** Evitar burnout e garantir tempo para limpeza/cigarro/café sem bloquear a agenda manualmente toda vez.
*   *Nota:* Atualmente implementado como configuração no perfil do Staff, pronto para ser consumido pelo algoritmo de agendamento automático futuramente.

### 7. Agendamento Online (Autoatendimento)
Local: `modules/online-booking/OnlineBookingWizard.tsx`

*   **Lógica de Slots:** O sistema expõe slots disponíveis baseados em `workSchedule` - `appointments` existentes.
*   **Integração:** O dono pode copiar um link único em `Settings` e usá-lo em templates de mensagem.
*   **Fluxo:** Serviço > Profissional > Data/Hora > Confirmação.

### 8. Gestão de Pausas (Breaks)
Local: `modules/settings/modals/StaffModal.tsx` e `context/BarberContext.tsx`

*   **Definição:** Intervalos fixos (Almoço, Café, Saída) configuráveis por dia da semana no perfil do Staff.
*   **Impacto:** O algoritmo `getAvailableSlots` remove automaticamente esses intervalos da lista de horários disponíveis para agendamento (Online e Manual), garantindo que o barbeiro não seja reservado durante seu descanso.

---

## ⚙️ Fluxos Críticos (Algoritmos)

### Agendamento & Detecção de Conflitos
Ao criar agendamento (`addAppointment`):
1.  Verifica disponibilidade do Staff no dia (`workSchedule`).
2.  Verifica competência (`allowedServices`).
3.  **Colisão:** Usa `date-fns/areIntervalsOverlapping` para garantir que o novo slot não bata com:
    *   Agendamentos existentes.
    *   Bloqueios manuais.
    *   **Pausas cadastradas (Almoço/Café).**

### Automação de Descontos (PDV)
Ao selecionar um cliente no PDV:
1.  Verifica Aniversário (Mês/Dia batem com hoje?).
2.  Verifica Win-Back (Última visita > `winBackDays`?).
3.  Aplica o desconto automaticamente se configurado nas Settings.

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais
- `tenants` - Barbearias/Lojas (Multi-tenant)
- `profiles` - Staff/Funcionários
- `clients` - Clientes
- `services` - Serviços
- `products` - Produtos
- `appointments` - Agendamentos
- `sales` - Vendas
- `sale_items` - Itens da venda
- `expenses` - Despesas

### RLS (Row Level Security)
Todas as tabelas possuem políticas RLS para garantir isolamento multi-tenant.

---

## 📜 Histórico de Versões & Changelog

### v2.0 - Next.js Migration & Supabase Integration
*   **Migration:** Projeto migrado de Vite para Next.js 16.
*   **Backend:** Integração completa com Supabase (Auth, Database, RLS).
*   **Middleware:** Implementado middleware Next.js para autenticação.
*   **Deploy:** Configurado deploy automático na Vercel.

### v1.5 - "Premium Gold" Branding & Security
*   **Branding:** Tema visual oficializado como "Premium Gold" (Zinc + Amber).
*   **PDV:** Implementada regra rígida de seleção de cliente. Removida venda anônima para garantir integridade de dados.
*   **Queue:** Adicionado botão de cadastro rápido de cliente diretamente na fila de espera.

### v1.4 - Stability & Quality of Life
*   **Website:** Implementação de rolagem suave (Smooth Scroll) na navegação do site público.
*   **Website:** Logo/Título agora funcionam como link para o topo da página (Hero).
*   **Staff:** Adicionada gestão de Pausas (Breaks) na configuração de horários (Almoço, Café, etc).
*   **Core:** Atualização do cálculo de disponibilidade para respeitar as pausas cadastradas no agendamento.

### v1.3 - UX Improvements
*   **Feature:** Adicionado atalho de "Copiar Link de Agendamento" diretamente no cabeçalho da Agenda para acesso rápido.

### v1.2 - Online Booking & Client Experience
*   **Feature:** Módulo `online-booking` criado. Permite agendamento externo pelo próprio cliente.
*   **Feature:** Nova aba em Settings para copiar o Link de Agendamento.
*   **Feature:** Templates de mensagem atualizados com variável `{booking_link}`.
*   **Core:** Função `getAvailableSlots` adicionada ao Contexto para calcular horários livres com precisão.

### v1.1 - Business Logic Refinement
*   **Feature:** Adicionado seletor de `QueueDistributionRule` (Fairness vs Speed) nas Configurações.
*   **Feature:** Implementado botão "Switch to Fastest" na fila de espera para clientes apressados.
*   **Fix:** Restauradas as abas de "Shop Profile" e "Team" que haviam sumido nas Configurações.
*   **Docs:** Inserido detalhamento de Smart Breaks no Blueprint.

### v1.0 - Foundation
*   Lançamento inicial com Agenda, PDV, Financeiro, Clientes e Estoque.

---

## 🚀 Guia de Extensão (Como adicionar features)

1.  **Novo Modelo de Dados:** Adicionar interface em `types.ts` e tabela em `supabase/schema.sql`.
2.  **Repository:** Criar `modules/[feature]/repository.ts` com chamadas Supabase.
3.  **Actions:** Criar `modules/[feature]/actions.ts` com Server Actions validadas por Zod.
4.  **UI:** Criar componente em `modules/[feature]/`.
5.  **Integração:** Conectar UI ao Repository via Hooks ou Actions.
6.  **Regra de Negócio:** Nunca deixar botões "mortos". Se a lógica for complexa, desabilite o botão com um tooltip.
7.  **Documentação:** Atualizar este arquivo (`BLUEPRINT.md`) com a nova regra.

---

*Documentação atualizada para BarberFlow Next.js*
