# 🎨 Redesign Landing Page - TODO

## Objetivo
Implementar o novo design moderno baseado nos layouts da pasta:
`D:\projetos\Antigravity\barbergold\layout\stitch_barbergold_landing_page authenticacao\stitch_barbergold_landing_page\`

## Arquivos de Referência
1. `barbergold_landing_page/code.html` - Landing page principal
2. `barbergold_forgot_password/code.html` - Página de forgot password

## Características do Novo Design

### Paleta de Cores
- Primary: `#f79f08` (dourado)
- Background Dark: `#0f0f11` / `#231c0f`
- Surface Dark: `#18181b`
- Text: Branco com variações de gray

### Elementos Visuais
- ✅ Background blur effects (gradientes circulares)
- ✅ Glass morphism (backdrop-blur)
- ✅ Glow effects nas sombras (`shadow-[0_0_20px_rgba(247,159,8,0.2)]`)
- ✅ Animações suaves (hover, translate-y, scale)
- ✅ Ícones usando Lucide React (substituir material-symbols)

## Seções da Landing Page

### 1. Header (Fixed)
- Logo com ícone Scissors
- Nav: Funcionalidades, Preços, Depoimentos, FAQ
- CTA: "Começar Teste"

### 2. Hero Section
- Badge: "Nova versão 3.0 disponível" com dot verde pulsante
- H1: "O Sistema Operacional da **Barbearia Moderna**"
- Descrição com foco em resultados
- 2 CTAs: "Começar Teste de 14 Dias" + "Ver Demonstração"
- Social proof: "+500 donos de barbearia"
- Mockup do dashboard (card com browser chrome)

### 3. Social Proof Bar
- "Usado pela elite"
- Stats: "R$ 5 Milhões" volume mensal, "500+ Ativas"
- Logos de clientes (placeholders)

### 4. Problem Section (Alerta de Prejuízo)
- Badge vermelho: "Alerta de Prejuízo"
- H2: "Pare de perder dinheiro invisível"
- 3 cards de problemas:
  - No-Shows Sem Multa
  - Comissões Erradas
  - Horários Ociosos

### 5. Features Section
- Grid assimétrico (5 cols + 7 cols)
- Lado esquerdo: 4 feature cards (Barber Club destacado)
- Lado direito: Hero image com overlay de benefícios

### 6. Mobile Experience Section
- Mockup de iPhone com chat WhatsApp
- 2 benefícios: "Sem Login, Sem App" + "Automação WhatsApp"

### 7. Pricing Section
- 3 planos: Start (R$ 89), Pro Gold (R$ 149 - destacado), Empire (R$ 299)
- Badge "Mais Popular" no Pro Gold
- Features list com ícones Check

### 8. Comparison Table (Opcional)
- Tabela responsiva com scroll horizontal
- Categorias: Gestão Essencial, Financeiro & Lucro, Escala & Operação

### 9. Testimonials Section
- 3 depoimentos com fotos, nomes e empresas
- 5 estrelas em cada
- Card central elevado (transform -translate-y-4)

### 10. FAQ Section
- Accordion com `<details>` nativo
- Ícone ChevronDown que rotaciona

### 11. Final CTA
- H2: "Pare de ser refém do WhatsApp"
- CTA grande: "Começar Teste Grátis"
- Disclaimer: "Sem cartão • Cancelamento a qualquer momento"

### 12. Footer
- Copyright
- Links: Termos, Privacidade, Contato (mailto:contato@barbergold.com)

## Implementação

### Arquivo: `src/modules/website/SaasLandingPage.tsx`

**Imports necessários:**
```typescript
import Link from 'next/link';
import { Scissors, DollarSign, Users, Calendar, TrendingDown, Shield, Star, Check, ArrowRight, Calculator, Smartphone, MessageSquare, Play, ChevronDown } from 'lucide-react';
```

**Estrutura:**
- Remover sistema de slug reservation (simplificar)
- Focar em conversão direta para /register
- Manter responsividade mobile-first

## Forgot Password Page

### Arquivo: `src/app/forgot-password/page.tsx`

**Mudanças:**
- Background com imagem de barbearia + overlay
- Card centralizado com logo dourado 3D (rotação + sombra)
- Cores: `#231c10` (card bg), `#ccb58f` (text secondary)
- Botão "Back to Login" com ícone ArrowLeft
- Barra decorativa no bottom (gradient dourado)

## Login Page

### Arquivo: `src/app/login/page.tsx`

**Layout Split Screen:**
- **Lado Esquerdo (Desktop only):** Imagem hero de barbearia com overlay gradient
  - Logo grande com ícone Scissors
  - Título: "BarberGOLD"
  - Descrição: "Premium management for the modern barbershop"
  - Background: Imagem de barbearia vintage com opacity 0.8
  - Gradient: `from-[#231c0f] via-[#231c0f]/60 to-transparent`

- **Lado Direito:** Formulário de login
  - Logo mobile (visível apenas em telas pequenas)
  - Título: "Welcome Back"
  - Descrição: "Please enter your details to sign in"
  - Campos:
    - Email or Username (input com border dourado no focus)
    - Password (com botão de toggle visibility)
  - Checkbox: "Remember me"
  - Link: "Forgot Password?" (text-primary)
  - Botão: "Log In" (bg-primary com glow effect)
  - Footer: "Don't have an account? Register Here"

**Cores específicas:**
- Card bg: `#231c10`
- Border: `#4a3e2a` / `#695430`
- Input bg: `#342a18`
- Text secondary: `#ccb58f`
- Primary: `#f79f08`

**Efeitos:**
- Glow no botão hover: `shadow-[0_0_20px_rgba(247,159,8,0.3)]`
- Active scale: `active:scale-[0.98]`
- Checkbox customizado com ícone check

## Register Page

### Arquivo: `src/app/register/page.tsx`

**Layout Split Screen (similar ao Login):**
- **Lado Esquerdo (Desktop only):** Hero visual com imagem de barbeiro
  - Logo pequeno no topo (ícone estrela + "BarberGOLD")
  - Título: "Join the Gold Standard."
  - Descrição: "Manage your shop with precision and style"
  - Progress dots (3 dots, primeiro ativo)
  - Footer: Copyright
  - Background: Imagem de barbeiro trabalhando (grayscale, opacity 60%)
  - Gradient overlay: `from-[#231c0f] via-[#231c0f]/80 to-transparent`

- **Lado Direito:** Formulário de registro
  - Logo mobile (visível apenas em telas pequenas) + link "Log In"
  - Título: "Create Account"
  - Descrição: "Enter your details below to get started"
  - Campos:
    - Full Name (placeholder: "e.g. James Cutter")
    - Email Address (placeholder: "name@barbershop.com")
    - Password (com toggle visibility)
    - Confirm Password (com toggle visibility)
  - Checkbox: "I agree to Terms of Service and Privacy Policy"
  - Botão: "Create Account" (bg-primary com glow effect)
  - Divider: "Or continue with"
  - Botão Google (com ícone SVG)
  - Footer: "Already have an account? Log In"

**Cores específicas:**
- Background: `#231c0f`
- Surface: `#342a18`
- Border: `#695430`
- Text muted: `#ccb58f`
- Primary: `#f79f08`

**Efeitos:**
- Focus ring: `focus:ring-2 focus:ring-primary/50`
- Button glow: `shadow-[0_0_20px_rgba(247,159,8,0.15)]`
- Hover glow: `hover:shadow-[0_0_25px_rgba(247,159,8,0.25)]`
- Custom scrollbar (webkit) com cores do tema

## Status
- [ ] Landing Page (SaasLandingPage.tsx)
- [ ] Forgot Password (forgot-password/page.tsx)
- [ ] Login Page (login/page.tsx)
- [ ] Register Page (register/page.tsx)

## Próxima Sessão
Implementar as mudanças de forma incremental:
1. Register page (split screen com hero image)
2. Login page (split screen com hero image)
3. Forgot password (card centralizado)
4. Landing page (todas as seções)
5. Testar build a cada implementação

## Observações Importantes
- Usar Lucide React para ícones (substituir material-symbols)
- Manter funcionalidade de OAuth Google existente
- Preservar validações e lógica de autenticação Supabase
- Adicionar imagens via next/image quando possível
- Configurar remotePatterns para imagens do Google (lh3.googleusercontent.com)
