# 🚀 Fluxo de Onboarding - BarberGold

## Visão Geral
O barbeiro seleciona **apenas os serviços que oferece** durante o setup inicial, evitando trabalho de desativar serviços desnecessários.

## 📋 Passo a Passo

### 1️⃣ Tela de Boas-Vindas
- Barbeiro cria conta e loja
- Define informações básicas (nome, endereço, etc)

### 2️⃣ Seleção de Serviços (Kit Preguiçoso)
Interface apresenta os serviços organizados por categoria com checkboxes:

```
📦 CATEGORIAS DISPONÍVEIS:

✂️ Cabelo Masculino
├── ☐ Corte Masculino (R$ 40, 30min)
├── ☐ Corte Social (R$ 50, 40min)
├── ☐ Degradê (R$ 45, 40min)
├── ☐ Corte Infantil (R$ 30, 25min)
├── ☐ Mid Fade (R$ 55, 45min)
├── ☐ Low Fade (R$ 55, 45min)
└── ☐ High Fade (R$ 55, 45min)

🧔 Barba & Bigode
├── ☐ Barba Simples (R$ 25, 15min)
├── ☐ Barba Completa (R$ 35, 30min)
├── ☐ Barba Navalhada (R$ 40, 30min)
├── ☐ Aparar Bigode (R$ 15, 10min)
└── ☐ Design de Barba (R$ 50, 40min)

✨ Acabamento
├── ☐ Pezinho (R$ 15, 10min)
├── ☐ Sobrancelha (R$ 15, 10min)
├── ☐ Risquinho (R$ 20, 15min)
└── ☐ Glitter (R$ 15, 10min)

💆‍♂️ Tratamentos
├── ☐ Hidratação Capilar (R$ 30, 20min)
├── ☐ Hidratação de Barba (R$ 30, 20min)
├── ☐ Massagem Relaxante (R$ 30, 20min)
└── ☐ Limpeza de Pele (R$ 70, 45min)

🔥 Combos
├── ☐ Corte + Barba (R$ 60, 60min)
├── ☐ Pacote Relax (R$ 85, 80min)
├── ☐ Pacote VIP (R$ 120, 90min)
└── ☐ Pai e Filho (R$ 65, 60min)

[Botões de Ação]
🔲 Selecionar Básicos | 🔲 Selecionar Todos | 🔲 Limpar Seleção
```

### 3️⃣ Revisão e Confirmação
```
📝 VOCÊ SELECIONOU:
- 4 serviços de Cabelo
- 3 serviços de Barba
- 2 serviços de Acabamento
- 2 Combos
Total: 11 serviços

⚡ Ações Rápidas:
[ Voltar e Editar ] [ Confirmar Seleção ]
```

### 4️⃣ Personalização (Opcional)
Após confirmar, o barbeiro pode:
- Ajustar preços
- Modificar durações
- Adicionar novos serviços personalizados
- Configurar horários de funcionamento

## 💾 Backend - Como Funciona

### Estrutura de Dados
```sql
-- 1. Templates globais (pré-populados)
service_categories_template  -- Categorias padrão
services_template            -- Serviços padrão
bundle_items_template        -- Itens dos combos

-- 2. Dados da loja (copiados na seleção)
service_categories          -- Categorias da loja
services                    -- Apenas serviços selecionados
bundle_items               -- Apenas bundles dos combos selecionados
```

### Função de Onboarding
```sql
-- Frontend envia array de UUIDs dos serviços selecionados
SELECT * FROM onboard_store_with_selected_services(
    'uuid-da-loja',
    ARRAY['uuid-servico-1', 'uuid-servico-2', ...]::UUID[]
);
```

### O que a função faz:
1. **Cria categorias** - Apenas das quais tem serviços selecionados
2. **Copia serviços** - Apenas os selecionados pelo barbeiro
3. **Configura combos** - Se combo foi selecionado E seus componentes também
4. **Retorna resultado** - Quantidade de serviços e bundles criados

## 🎯 Benefícios

### Para o Barbeiro:
- ✅ Setup rápido (< 5 minutos)
- ✅ Apenas serviços relevantes
- ✅ Preços sugeridos mas editáveis
- ✅ Sem "lixo" para limpar depois

### Para o Sistema:
- ✅ Dados limpos desde o início
- ✅ Menos armazenamento usado
- ✅ Melhor performance (menos registros)
- ✅ Analytics mais precisos

## 🔄 Pós-Onboarding

O barbeiro sempre pode:
- Adicionar novos serviços manualmente
- Reativar serviços do template
- Criar serviços personalizados
- Modificar preços e durações

## 📊 Métricas de Sucesso

- **Taxa de conclusão**: > 80% completam onboarding
- **Tempo médio**: < 5 minutos
- **Serviços selecionados**: Média 15-20 por barbearia
- **Retenção**: > 90% mantém serviços iniciais

## 🚦 Status Atual

- ✅ Schema das tabelas criado
- ✅ Kit preguiçoso populado
- ✅ Funções de onboarding criadas
- ✅ Views auxiliares prontas
- ⏳ Frontend precisa implementar seleção
- ⏳ Testes E2E pendentes

## 📝 Notas de Implementação

### Frontend (React)
```typescript
// 1. Buscar serviços disponíveis
const templates = await supabase
  .from('v_template_services_by_category')
  .select('*')
  .order('category_order, service_name');

// 2. Usuário seleciona serviços
const selectedIds = [...]; // IDs selecionados

// 3. Chamar função de onboarding
const { data, error } = await supabase
  .rpc('onboard_store_with_selected_services', {
    p_store_id: storeId,
    p_selected_service_ids: selectedIds
  });

// 4. Redirecionar para dashboard
if (data.success) {
  router.push('/dashboard');
}
```

### Considerações UX
- Mostrar preview em tempo real dos serviços selecionados
- Permitir busca/filtro de serviços
- Sugerir "pacotes" pré-selecionados (Básico, Completo, Premium)
- Mostrar estimativa de faturamento baseado nos serviços
- Permitir importar lista de serviços (CSV/Excel)
