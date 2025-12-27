# 🌎 Guia de Internacionalização (i18n)

## 📋 Status Atual

✅ **Infraestrutura Completa**
- next-intl instalado e configurado
- Estrutura de pastas criada
- Middleware de detecção de idioma ativo
- Hook personalizado `useI18n()` disponível

⚠️ **Sistema em Português**
- Todos os textos ainda estão hardcoded em português
- Tradução será feita gradualmente
- Sistema funciona normalmente

## 🗂️ Estrutura de Arquivos

```
src/
├── i18n/
│   ├── config.ts          # Configuração de locales
│   └── request.ts         # Carregamento de mensagens
├── locales/
│   ├── pt-BR/
│   │   ├── common.json    # Traduções comuns
│   │   └── payments.json  # Traduções de pagamentos
│   ├── es-CL/
│   │   ├── common.json
│   │   └── payments.json
│   └── en-US/
│       ├── common.json
│       └── payments.json
├── hooks/
│   └── useI18n.ts         # Hook personalizado
├── types/
│   └── i18n.ts            # Tipos TypeScript
└── middleware.ts          # Middleware Next.js
```

## 🎯 Locales Suportados

| Locale | País | Moeda | Timezone |
|--------|------|-------|----------|
| `pt-BR` | 🇧🇷 Brasil | R$ (BRL) | America/Sao_Paulo |
| `es-CL` | 🇨🇱 Chile | $ (CLP) | America/Santiago |
| `en-US` | 🇺🇸 EUA | $ (USD) | America/New_York |

## 🔧 Como Usar

### 1. Hook `useI18n()`

```tsx
import { useI18n } from '@/hooks/useI18n';

function MyComponent() {
  const { t, locale, formatCurrency, formatDate } = useI18n();

  return (
    <div>
      {/* Traduzir texto */}
      <h1>{t('common.save')}</h1>
      
      {/* Formatar moeda */}
      <p>{formatCurrency(150.50)}</p>
      
      {/* Formatar data */}
      <p>{formatDate(new Date())}</p>
      
      {/* Locale atual */}
      <p>Idioma: {locale}</p>
    </div>
  );
}
```

### 2. Adicionar Novas Traduções

**Passo 1:** Adicione a chave no arquivo JSON

```json
// src/locales/pt-BR/common.json
{
  "myNewSection": {
    "title": "Meu Título",
    "description": "Minha Descrição"
  }
}
```

**Passo 2:** Adicione nos outros idiomas

```json
// src/locales/es-CL/common.json
{
  "myNewSection": {
    "title": "Mi Título",
    "description": "Mi Descripción"
  }
}
```

```json
// src/locales/en-US/common.json
{
  "myNewSection": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

**Passo 3:** Use no componente

```tsx
const title = t('myNewSection.title');
```

### 3. Criar Novo Arquivo de Tradução

**Exemplo:** Criar traduções para módulo de clientes

**1. Criar arquivos:**
```
src/locales/pt-BR/clients.json
src/locales/es-CL/clients.json
src/locales/en-US/clients.json
```

**2. Adicionar conteúdo:**
```json
{
  "title": "Clientes",
  "addNew": "Adicionar Cliente",
  "fields": {
    "name": "Nome",
    "phone": "Telefone",
    "email": "E-mail"
  }
}
```

**3. Importar em `src/i18n/request.ts`:**
```typescript
return {
  locale,
  messages: {
    ...(await import(`../locales/${locale}/common.json`)).default,
    ...(await import(`../locales/${locale}/payments.json`)).default,
    ...(await import(`../locales/${locale}/clients.json`)).default, // ← NOVO
  }
};
```

## 🚀 Migração Gradual

### Estratégia Recomendada

1. **Fase 1: Novos Componentes**
   - Todos os novos componentes devem usar `t()` desde o início
   - Exemplo: `<button>{t('common.save')}</button>`

2. **Fase 2: Componentes Críticos**
   - Migrar componentes de pagamento primeiro
   - Depois navegação e dashboard
   - Por último, páginas internas

3. **Fase 3: Textos Dinâmicos**
   - Mensagens de erro
   - Notificações
   - Validações

### Exemplo de Migração

**ANTES (Hardcoded):**
```tsx
<button className="btn">Salvar</button>
<p>Erro ao salvar dados</p>
```

**DEPOIS (i18n):**
```tsx
const { t } = useI18n();

<button className="btn">{t('common.save')}</button>
<p>{t('errors.saveFailed')}</p>
```

## 💰 Formatação de Moeda

### Automática por Locale

```tsx
const { formatCurrency } = useI18n();

// Brasil: R$ 150,50
// Chile: $150
// EUA: $150.50
formatCurrency(150.50);
```

### Customizada

```tsx
const { formatNumber } = useI18n();

formatNumber(1234.56, {
  style: 'currency',
  currency: 'EUR'
});
```

## 📅 Formatação de Data

```tsx
const { formatDate } = useI18n();

// Brasil: 27/12/2025
// Chile: 27/12/2025
// EUA: 12/27/2025
formatDate(new Date());

// Com opções
formatDate(new Date(), {
  dateStyle: 'full',
  timeStyle: 'short'
});
```

## 🔀 Trocar Idioma

### No Cliente (Futuro)

```tsx
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  const changeLocale = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  return (
    <select value={locale} onChange={(e) => changeLocale(e.target.value)}>
      <option value="pt-BR">🇧🇷 Português</option>
      <option value="es-CL">🇨🇱 Español</option>
      <option value="en-US">🇺🇸 English</option>
    </select>
  );
}
```

## 🎨 Diferenças por País

### Métodos de Pagamento

```typescript
import { countryConfigs } from '@/types/i18n';

const { locale } = useI18n();
const config = countryConfigs[locale];

// Brasil: ['PIX', 'Mercado Pago', 'PagSeguro', ...]
// Chile: ['Mercado Pago', 'Webpay', 'Khipu']
// EUA: ['Stripe', 'Square', 'PayPal', 'Venmo']
console.log(config.paymentMethods);
```

### Documentos

```typescript
// Brasil: ['CPF', 'CNPJ']
// Chile: ['RUT']
// EUA: ['SSN', 'EIN']
console.log(config.documentTypes);
```

## ⚠️ Boas Práticas

### ✅ FAÇA

```tsx
// Use chaves descritivas
t('payments.methods.credit_card')

// Organize por módulo
t('clients.form.name')

// Use interpolação
t('welcome.message', { name: userName })
```

### ❌ NÃO FAÇA

```tsx
// Não hardcode textos
<button>Salvar</button>

// Não use chaves genéricas
t('text1')

// Não concatene strings
t('hello') + ' ' + userName
```

## 🧪 Testar i18n

```bash
# Testar em português (padrão)
npm run dev

# Testar em espanhol
# Acesse: http://localhost:3000/es-CL

# Testar em inglês
# Acesse: http://localhost:3000/en-US
```

## 📝 Checklist de Migração

Ao migrar um componente para i18n:

- [ ] Identificar todos os textos hardcoded
- [ ] Criar chaves de tradução nos 3 idiomas
- [ ] Substituir textos por `t('chave')`
- [ ] Testar em todos os idiomas
- [ ] Verificar formatação de moeda/data
- [ ] Commit com mensagem: `feat(i18n): migrate ComponentName`

## 🆘 Problemas Comuns

### Erro: "Messages not found"
**Solução:** Verifique se importou o arquivo JSON em `src/i18n/request.ts`

### Erro: "useTranslations must be used in client component"
**Solução:** Adicione `'use client'` no topo do arquivo

### Tradução não aparece
**Solução:** Verifique se a chave existe em todos os arquivos JSON

## 📚 Recursos

- [Documentação next-intl](https://next-intl.dev)
- [Formatação Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Timezones IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

---

**Status:** ✅ Infraestrutura pronta | ⏳ Tradução gradual | 🇧🇷 Sistema em português
