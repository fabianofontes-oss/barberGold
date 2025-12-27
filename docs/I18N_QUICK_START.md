# 🚀 i18n Quick Start

## ✅ O Que Está Pronto

```
✅ next-intl instalado
✅ Middleware configurado
✅ 3 locales: pt-BR (🇧🇷), es-CL (🇨🇱), en-US (🇺🇸)
✅ Hook useI18n() disponível
✅ Arquivos de tradução base criados
✅ Sistema funcionando em português
```

## 🎯 Como Começar a Usar (Quando Quiser)

### 1️⃣ Exemplo Simples

**ANTES:**
```tsx
<button>Salvar</button>
```

**DEPOIS:**
```tsx
'use client';
import { useI18n } from '@/hooks/useI18n';

function MyComponent() {
  const { t } = useI18n();
  return <button>{t('common.save')}</button>;
}
```

### 2️⃣ Exemplo com Moeda

**ANTES:**
```tsx
<p>R$ {price.toFixed(2)}</p>
```

**DEPOIS:**
```tsx
const { formatCurrency } = useI18n();
<p>{formatCurrency(price)}</p>
```

### 3️⃣ Adicionar Nova Tradução

**1. Edite os 3 arquivos JSON:**

`src/locales/pt-BR/common.json`:
```json
{
  "myFeature": {
    "title": "Meu Título"
  }
}
```

`src/locales/es-CL/common.json`:
```json
{
  "myFeature": {
    "title": "Mi Título"
  }
}
```

`src/locales/en-US/common.json`:
```json
{
  "myFeature": {
    "title": "My Title"
  }
}
```

**2. Use no código:**
```tsx
const title = t('myFeature.title');
```

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `src/hooks/useI18n.ts` | Hook principal |
| `src/locales/pt-BR/*.json` | Traduções em português |
| `src/locales/es-CL/*.json` | Traduções em espanhol |
| `src/locales/en-US/*.json` | Traduções em inglês |
| `src/i18n/config.ts` | Configuração de locales |
| `docs/I18N_GUIDE.md` | Guia completo |

## 🎨 Diferenças por País

### Moeda
- 🇧🇷 Brasil: **R$ 150,50**
- 🇨🇱 Chile: **$150**
- 🇺🇸 EUA: **$150.50**

### Data
- 🇧🇷 Brasil: **27/12/2025**
- 🇨🇱 Chile: **27/12/2025**
- 🇺🇸 EUA: **12/27/2025**

### Métodos de Pagamento
- 🇧🇷 Brasil: PIX, Mercado Pago, PagSeguro, InfinitePay, Stone
- 🇨🇱 Chile: Mercado Pago, Webpay, Khipu
- 🇺🇸 EUA: Stripe, Square, PayPal, Venmo

### Documentos
- 🇧🇷 Brasil: CPF, CNPJ
- 🇨🇱 Chile: RUT
- 🇺🇸 EUA: SSN, EIN

## 🔥 Regras de Ouro

1. **Novos componentes:** Use `t()` desde o início
2. **Não hardcode:** Sempre use traduções
3. **3 idiomas:** Adicione tradução nos 3 arquivos
4. **Teste:** Acesse `/es-CL` e `/en-US` para testar

## 🧪 Testar Agora

```bash
# Português (padrão)
http://localhost:3000

# Espanhol
http://localhost:3000/es-CL

# Inglês
http://localhost:3000/en-US
```

## 📚 Documentação Completa

Leia `docs/I18N_GUIDE.md` para:
- Exemplos avançados
- Formatação de data/hora
- Criar novos arquivos de tradução
- Estratégia de migração
- Troubleshooting

---

**Status:** ✅ Pronto para usar | 🇧🇷 Sistema em português | 🌎 Expansão quando necessário
