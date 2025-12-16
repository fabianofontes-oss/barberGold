# Release Checklist (DEMO / PILOT / PROD)

## Variáveis de ambiente

- `NEXT_PUBLIC_APP_MODE`
  - Valores aceitos: `demo|pilot|prod` **ou** `DEMO|PILOT|PROD`
  - Default: `demo` (equivalente a `DEMO`)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Modos de operação

### DEMO

- Persistência via `localStorage`.
- Não requer Supabase.
- Tenants/referrals são “seedados” com mocks e passam a persistir localmente.

### PILOT

- Persistência via Supabase (sem Auth/RLS por enquanto).
- Requer tabelas mínimas:
  - `tenants_registry`
  - `app_session` (singleton)
  - `referral_partners`
  - `referral_sales`
  - `tenant_referral_config`

### PROD

- Ainda não habilitado com segurança nesta fase.

## Smoke tests (rápidos)

- `npm run build`
- Abrir `/` (login) e entrar.
- Navegar (estado atual): Dashboard, Plan, Referrals, Settings.
- Navegar (rotas novas):
  - `/app/dashboard`
  - `/app/agenda`
  - `/app/pdv`
  - `/app/clients`
  - `/app/finance`
  - `/app/settings`
  - `/app/referrals`
  - `/app/plan`

## Rotas críticas

- Login (tela inicial): `/`
- App (rotas finas): `/app/*`

## Plano de rollback

- Reverter `NEXT_PUBLIC_APP_MODE` para `demo`.
- Se PILOT estiver instável, desabilitar/ignorar as tabelas Supabase e voltar para DEMO.
- Reverter commit do data-adapter/repositories se necessário.
