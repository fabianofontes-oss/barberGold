# Payment Functionality Implementation

## Status: EM IMPLEMENTAÇÃO

### Concluído:
- ✅ Tipos adicionados em `src/types.ts`
- ✅ Mercado Pago conectado ao estado
- ✅ PagSeguro conectado ao estado

### Pendente:
- ⏳ Stripe (toggle + campos)
- ⏳ PIX Config (tipo, chave, beneficiário)
- ⏳ Installment Config (parcelas, juros, valor mínimo)
- ⏳ Bank Account (banco, agência, conta, titular)

### Arquivos Modificados:
1. `src/types.ts` - Tipos expandidos
2. `src/modules/settings/Settings.tsx` - Conectando campos ao estado

### Próximos Passos:
Continuar conectando os campos restantes ao estado usando `updateShopSettings()`.
