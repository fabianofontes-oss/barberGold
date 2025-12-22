# ✅ CHECKLIST PRÉ-LANÇAMENTO - BARBERFLOW

**Data:** Dezembro 2025  
**Status:** 🟡 Em Preparação

Use este checklist para garantir que tudo está pronto antes do lançamento.

---

## 🔐 SEGURANÇA

### Credenciais e Secrets
- [ ] Todas as env vars estão no Vercel
- [ ] Nenhuma API key exposta no código
- [ ] `.env.local` está no `.gitignore`
- [ ] Backup das credenciais em local seguro
- [ ] Stripe em modo LIVE (não TEST)
- [ ] Webhook secrets corretos

### Banco de Dados
- [ ] RLS policies ativas em todas as tabelas
- [ ] Filtros tenant_id em todas as queries
- [ ] Validação de ownership em updates/deletes
- [ ] Backups automáticos configurados
- [ ] Senha do banco forte e guardada

### Autenticação
- [ ] Supabase Auth URLs configuradas
- [ ] Redirect URLs permitidas
- [ ] Session timeout configurado
- [ ] Password recovery funciona
- [ ] Rate limiting ativo

---

## 🎨 FRONTEND

### Páginas Principais
- [ ] Landing page (/)
- [ ] Login (/login)
- [ ] Registro (/register)
- [ ] Pricing (/pricing)
- [ ] FAQ (/faq)
- [ ] About (/about)
- [ ] Contact (/contact)
- [ ] Terms (/terms)
- [ ] Privacy (/privacy)
- [ ] 404 (/not-found)
- [ ] 500 (/error)

### UI/UX
- [ ] Loading states em todas as páginas
- [ ] Empty states onde aplicável
- [ ] Error boundaries funcionando
- [ ] Toast notifications testadas
- [ ] Skeleton loaders aparecendo
- [ ] Formulários com validação
- [ ] Botões com loading states
- [ ] Confirmação de delete
- [ ] Mobile 100% responsivo
- [ ] Touch gestures funcionando

### Performance
- [ ] Lighthouse Score > 85
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.9s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Imagens otimizadas
- [ ] Código minificado
- [ ] Bundle size aceitável

---

## 💼 FUNCIONALIDADES

### Gestão de Clientes
- [ ] Listar clientes
- [ ] Criar cliente
- [ ] Editar cliente
- [ ] Deletar cliente (com confirmação)
- [ ] Buscar clientes
- [ ] Filtrar clientes
- [ ] Exportar clientes (se aplicável)
- [ ] Paginação funciona

### Gestão de Agendamentos
- [ ] Listar agendamentos
- [ ] Criar agendamento
- [ ] Editar agendamento
- [ ] Cancelar agendamento
- [ ] Completar agendamento
- [ ] Marcar no-show
- [ ] Vista de calendário
- [ ] Filtros por data/status
- [ ] Busca funciona

### PDV/Vendas
- [ ] Adicionar items ao carrinho
- [ ] Remover items
- [ ] Calcular total automaticamente
- [ ] Aplicar desconto
- [ ] Processar venda
- [ ] Escolher método de pagamento
- [ ] Histórico de vendas
- [ ] Filtros e busca

### Comissões (Planos PRO+)
- [ ] Cálculo automático
- [ ] Relatório por período
- [ ] Relatório por profissional
- [ ] Export de dados

---

## 💰 PAGAMENTOS (STRIPE)

### Checkout
- [ ] Página /pricing carrega
- [ ] Toggle mensal/anual funciona
- [ ] Botões de checkout funcionam
- [ ] Redirect para Stripe funciona
- [ ] Success redirect funciona
- [ ] Cancel redirect funciona
- [ ] Teste com cartão 4242...

### Webhooks
- [ ] Webhook URL configurada no Stripe
- [ ] Evento `checkout.session.completed` funciona
- [ ] Evento `customer.subscription.updated` funciona
- [ ] Evento `customer.subscription.deleted` funciona
- [ ] Evento `invoice.payment_succeeded` funciona
- [ ] Evento `invoice.payment_failed` funciona
- [ ] Status do tenant atualiza corretamente
- [ ] Logs de webhook sem erros

### Billing Portal
- [ ] Botão "Gerenciar Assinatura" funciona
- [ ] Redirect para portal funciona
- [ ] Consegue ver faturas
- [ ] Consegue atualizar cartão
- [ ] Consegue cancelar assinatura
- [ ] Return URL funciona

### Feature Gating
- [ ] Plano FREE: limite de 10 clientes
- [ ] Plano FREE: limite de 20 agendamentos
- [ ] Modal de upgrade aparece
- [ ] Botão de upgrade funciona
- [ ] Após upgrade, limites aumentam

---

## 🌐 MULTI-TENANCY

### Subdomains
- [ ] DNS wildcard configurado (`*.barber.gold`)
- [ ] Subdomain detection funciona
- [ ] Tenant lookup por slug funciona
- [ ] Redirect para /tenant-not-found se inválido
- [ ] Headers `x-tenant-id` e `x-tenant-slug` setados

### Registro de Tenant
- [ ] Página /register carrega
- [ ] Validação de subdomain funciona
- [ ] Nomes proibidos bloqueados
- [ ] Sugestões de nomes funcionam
- [ ] Check de disponibilidade funciona (real-time)
- [ ] Criação de tenant + usuário funciona
- [ ] Redirect após registro funciona
- [ ] Email de confirmação enviado (Supabase)

### Isolamento de Dados
- [ ] Queries filtradas por tenant_id
- [ ] Cross-tenant read bloqueado
- [ ] Cross-tenant write bloqueado
- [ ] Teste com 2 tenants diferentes
- [ ] RLS policies funcionando

---

## 📊 ONBOARDING

### Welcome Modal
- [ ] Aparece no primeiro login
- [ ] Opção de popular dados de exemplo
- [ ] Seed data funciona
- [ ] Modal não aparece novamente
- [ ] Pode ser fechado

### Tour Guiado
- [ ] Tour Dashboard funciona
- [ ] Tour Clientes funciona
- [ ] Tour Agendamentos funciona
- [ ] Tour PDV funciona
- [ ] Botão de ajuda (?) visível
- [ ] Menu de tours funciona
- [ ] Progresso salvo (não repete)

---

## 📈 ANALYTICS & MONITORING

### Vercel
- [ ] Analytics ativado
- [ ] Logs funcionando
- [ ] Função logs sem erros
- [ ] Alerts configurados

### Sentry (Opcional)
- [ ] Projeto criado
- [ ] DSN configurado
- [ ] Source maps enviados
- [ ] Erros sendo capturados
- [ ] Releases configuradas

### Performance
- [ ] Web Vitals monitoradas
- [ ] Slow queries identificadas
- [ ] Bundle size monitorado

---

## 🧪 TESTES

### Smoke Tests
- [ ] Homepage carrega
- [ ] Login funciona
- [ ] Criar cliente funciona
- [ ] Criar agendamento funciona
- [ ] Processar venda funciona
- [ ] Logout funciona

### Browser Testing
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari iOS
- [ ] Samsung Internet

### Edge Cases
- [ ] Tenant não encontrado
- [ ] Email já cadastrado
- [ ] Subdomain já em uso
- [ ] Cartão recusado
- [ ] Webhook falha
- [ ] Session expirada
- [ ] Sem conexão

---

## 🚀 DEPLOY

### Vercel
- [ ] Projeto criado
- [ ] Repositório conectado
- [ ] Build sucesso
- [ ] Deploy sucesso
- [ ] Preview deploys funcionando
- [ ] Production URL ativa

### Domínio
- [ ] Domínio adicionado no Vercel
- [ ] DNS configurado
- [ ] Wildcard DNS configurado
- [ ] SSL certificado ativo (HTTPS)
- [ ] Propagação completa
- [ ] WWW redirect funciona

### Environment Variables
- [ ] Production env vars configuradas
- [ ] Preview env vars (se diferentes)
- [ ] Nenhuma secret exposta
- [ ] Site URL correto

---

## 📝 CONTEÚDO

### Textos
- [ ] Sem erros de português
- [ ] Termos técnicos corretos
- [ ] CTAs claros
- [ ] Valores de preços corretos
- [ ] Informações de contato corretas

### Legal
- [ ] Termos de Serviço completos
- [ ] Política de Privacidade completa
- [ ] LGPD compliance (se Brasil)
- [ ] GDPR compliance (se Europa)
- [ ] Informações da empresa
- [ ] CNPJ/CPF (se aplicável)

### SEO
- [ ] Meta tags em todas as páginas
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Sitemap.xml gerado
- [ ] Robots.txt configurado
- [ ] Favicon presente
- [ ] Google Search Console configurado

---

## 📣 MARKETING

### Preparação
- [ ] Logo final
- [ ] Paleta de cores definida
- [ ] Screenshots atualizados
- [ ] Vídeo demo gravado
- [ ] Pitch deck pronto

### Canais
- [ ] Redes sociais criadas
- [ ] Página no Facebook
- [ ] Perfil no Instagram
- [ ] LinkedIn company page
- [ ] Email marketing setup

### Lançamento
- [ ] Lista de espera (se houver)
- [ ] Email de lançamento redigido
- [ ] Posts agendados
- [ ] Anúncios criados (se houver)
- [ ] Cupom de desconto (se houver)

---

## 🆘 SUPORTE

### Documentação
- [ ] README.md atualizado
- [ ] DEPLOY_GUIDE.md completo
- [ ] FAQ atualizado
- [ ] Guias de uso (se houver)

### Canais de Suporte
- [ ] Email de suporte configurado
- [ ] WhatsApp Business (se houver)
- [ ] Chat ao vivo (se houver)
- [ ] Sistema de tickets (se houver)

### Preparação da Equipe
- [ ] Equipe treinada
- [ ] Escalation path definido
- [ ] SLA definido
- [ ] Respostas padrão criadas

---

## 🎯 MÉTRICAS DE SUCESSO

### KPIs Definidos
- [ ] Taxa de conversão esperada
- [ ] CAC (Custo de Aquisição)
- [ ] LTV (Lifetime Value)
- [ ] Churn rate aceitável
- [ ] MRR meta mensal

### Tracking
- [ ] Google Analytics configurado
- [ ] Conversions tracking
- [ ] Funnel definido
- [ ] Goals configuradas

---

## ✅ APROVAÇÕES FINAIS

### Técnica
- [ ] ✅ Code review completo
- [ ] ✅ Security review
- [ ] ✅ Performance review
- [ ] ✅ Accessibility review

### Negócio
- [ ] ✅ Aprovação do produto
- [ ] ✅ Aprovação legal
- [ ] ✅ Aprovação financeira
- [ ] ✅ Go/No-Go decision

### Comunicação
- [ ] ✅ Stakeholders informados
- [ ] ✅ Equipe alinhada
- [ ] ✅ Data de lançamento definida
- [ ] ✅ Plano B se algo der errado

---

## 🚨 PLANO DE ROLLBACK

### Se algo der muito errado:
1. [ ] Rollback no Vercel para versão anterior
2. [ ] Pausar novos cadastros
3. [ ] Comunicar usuários afetados
4. [ ] Investigar causa raiz
5. [ ] Corrigir problema
6. [ ] Testar novamente
7. [ ] Re-deploy

---

## 🎉 PÓS-LANÇAMENTO (Primeiras 48h)

### Monitoramento
- [ ] Verificar logs a cada hora
- [ ] Monitorar webhooks
- [ ] Acompanhar analytics
- [ ] Ler feedback dos usuários
- [ ] Responder dúvidas rapidamente

### Ajustes Rápidos
- [ ] Lista de issues conhecidos
- [ ] Priorização de fixes
- [ ] Deploys de hotfix se necessário

---

## ✨ RESULTADO FINAL

**Checklist Completo:** ___/200 items

**Status Geral:**
- 🟢 Verde: Pronto para lançar
- 🟡 Amarelo: Precisa de atenção
- 🔴 Vermelho: Bloqueador

**Data Prevista de Lançamento:** ___/___/2025

**Data Real de Lançamento:** ___/___/2025

---

**🚀 Boa sorte no lançamento do BarberGold!**

*"O sucesso é a soma de pequenos esforços repetidos dia após dia."*

