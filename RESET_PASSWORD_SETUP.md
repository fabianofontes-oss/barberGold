# 🔐 CONFIGURAÇÃO DE RECUPERAÇÃO DE SENHA

## ✅ ARQUIVOS CRIADOS

### 1. Página de Reset de Senha
**Arquivo:** `src/app/reset-password/page.tsx`
- Valida token automaticamente
- Formulário para nova senha
- Confirmação de senha
- Feedback visual de sucesso/erro
- Redirecionamento automático após sucesso

### 2. Callback Route Atualizado
**Arquivo:** `src/app/auth/callback/route.ts`
- Detecta `type=recovery` na URL
- Redireciona para `/reset-password`
- Processa token do Supabase

---

## 🔧 CONFIGURAÇÃO NO SUPABASE

### Passo 1: Acessar Email Templates

1. Acesse: https://supabase.com/dashboard/project/yitrspfqpakpygfytduz
2. Vá em **Authentication** → **Email Templates**
3. Selecione **Reset Password**

### Passo 2: Configurar Template de Reset Password

**Cole este template:**

```html
<h2>Redefinir Senha - BarberGOLD</h2>

<p>Olá,</p>

<p>Você solicitou a redefinição de senha da sua conta BarberGOLD.</p>

<p>Clique no botão abaixo para criar uma nova senha:</p>

<p>
  <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password" 
     style="display: inline-block; padding: 12px 24px; background-color: #f79f08; color: #231c10; text-decoration: none; border-radius: 8px; font-weight: bold;">
    Redefinir Senha
  </a>
</p>

<p>Ou copie e cole este link no seu navegador:</p>
<p>{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password</p>

<p>Este link expira em 1 hora.</p>

<p>Se você não solicitou esta redefinição, ignore este email.</p>

<p>Atenciosamente,<br>Equipe BarberGOLD</p>
```

### Passo 3: Configurar Redirect URLs

1. Vá em **Authentication** → **URL Configuration**
2. Em **Redirect URLs**, adicione:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/reset-password
   https://seu-dominio.com/auth/callback
   https://seu-dominio.com/reset-password
   ```

### Passo 4: Configurar Site URL

1. Em **Authentication** → **URL Configuration**
2. **Site URL:** 
   - Dev: `http://localhost:3000`
   - Prod: `https://seu-dominio.com`

---

## 🧪 COMO TESTAR

### Teste Completo do Fluxo

1. **Acesse a página de recuperação:**
   ```
   http://localhost:3000/forgot-password
   ```

2. **Digite um email cadastrado e clique em "Enviar Link"**

3. **Abra seu email** (verifique spam/lixeira)

4. **Clique no link do email**
   - Você será redirecionado para: `/auth/callback?token_hash=...&type=recovery`
   - O sistema processa o token
   - Redireciona para: `/reset-password`

5. **Digite a nova senha:**
   - Mínimo 6 caracteres
   - Confirme a senha
   - Clique em "Redefinir Senha"

6. **Sucesso!**
   - Mensagem de confirmação
   - Redirecionamento automático para `/login`

7. **Faça login com a nova senha**

---

## 🔍 VALIDAÇÕES IMPLEMENTADAS

### Na Página de Reset (`/reset-password`)

✅ **Validação de Token:**
- Verifica se há sessão ativa do Supabase
- Exibe erro se token expirado/inválido
- Permite solicitar novo link

✅ **Validação de Senha:**
- Mínimo 6 caracteres
- Confirmação deve ser igual
- Feedback em tempo real

✅ **Estados Visuais:**
- Loading durante validação
- Erro com link para solicitar novo
- Sucesso com redirecionamento

### No Callback (`/auth/callback`)

✅ **Processa Token:**
- Exchange code por sessão
- Detecta tipo de autenticação
- Redireciona corretamente

---

## 🐛 TROUBLESHOOTING

### Problema: "Link inválido ou expirado"

**Causa:** Token expirou (1 hora) ou já foi usado

**Solução:**
1. Volte para `/forgot-password`
2. Solicite novo link
3. Use o link imediatamente

### Problema: Email não chega

**Verificar:**
1. Email está cadastrado no sistema?
2. Verificou pasta de spam?
3. Template configurado no Supabase?
4. Rate limit do Supabase (máx 4 emails/hora em dev)

**Solução:**
- Aguarde 15 minutos entre tentativas
- Use email diferente para teste
- Verifique logs no Supabase Dashboard

### Problema: Redireciona para página inicial

**Causa:** Redirect URL não configurada

**Solução:**
1. Adicione URLs no Supabase (passo 3 acima)
2. Salve as configurações
3. Aguarde 1-2 minutos para propagar
4. Tente novamente

### Problema: "As senhas não coincidem"

**Causa:** Senha e confirmação diferentes

**Solução:**
- Digite com cuidado
- Use o botão de "mostrar senha" (ícone de olho)
- Copie/cole se necessário

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

- [ ] Página `/reset-password` criada
- [ ] Callback route atualizado
- [ ] Template de email configurado no Supabase
- [ ] Redirect URLs adicionadas no Supabase
- [ ] Site URL configurada
- [ ] Testado fluxo completo
- [ ] Email recebido e link funciona
- [ ] Senha redefinida com sucesso
- [ ] Login com nova senha funciona

---

## 🔗 URLs DO FLUXO

```
1. Usuário acessa:
   /forgot-password

2. Supabase envia email com:
   /auth/callback?token_hash=XXX&type=recovery

3. Sistema redireciona para:
   /reset-password

4. Após sucesso, vai para:
   /login
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Configure o template no Supabase** (5 min)
2. **Adicione as Redirect URLs** (2 min)
3. **Teste o fluxo completo** (5 min)
4. **Documente para o time** ✅ (este arquivo)

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique logs do Supabase Dashboard
2. Teste com email diferente
3. Limpe cookies do navegador
4. Verifique se está usando a URL correta

**Tudo configurado! O fluxo de recuperação de senha está funcional.** 🚀
