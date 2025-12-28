// Script para configurar o banco de dados
// Execute com: node setup-database.js

/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Helper para ler variáveis de ambiente de arquivo
function loadEnv(filename) {
  try {
    const envPath = path.join(__dirname, filename);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const vars = {};
      content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
          vars[key] = value;
        }
      });
      return vars;
    }
  } catch (e) {
    // Ignore errors
  }
  return {};
}

const envVars = { ...loadEnv('.env'), ...loadEnv('.env.local') };
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

// Configurações do admin
const adminEmail = process.env.ADMIN_EMAIL || envVars.ADMIN_EMAIL || 'admin@barbergold.com';
// Gera senha aleatória se não fornecida
const adminPassword = process.env.ADMIN_PASSWORD || envVars.ADMIN_PASSWORD || crypto.randomBytes(12).toString('hex');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas.');
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas em .env ou .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados...\n');

  try {
    // Ler o schema SQL
    const schemaPath = path.join(__dirname, 'supabase', 'schema-complete.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Schema carregado, executando no banco...');
    
    // Para executar SQL direto, você precisa fazer via Dashboard do Supabase
    console.log('\n⚠️  IMPORTANTE:');

    // Extrair ID do projeto da URL se possível para mostrar o link correto
    let projectId = 'seu-projeto';
    try {
        const urlObj = new URL(supabaseUrl);
        projectId = urlObj.hostname.split('.')[0];
    } catch (e) {
        // Fallback
    }

    console.log(`1. Acesse: https://supabase.com/dashboard/project/${projectId}/sql/new`);
    console.log('2. Cole o conteúdo do arquivo: supabase/schema-complete.sql');
    console.log('3. Clique em "Run" para executar\n');

    // Vamos criar um usuário de teste
    console.log('👤 Criando usuário de teste...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ Usuário já existe');
      } else {
        throw authError;
      }
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Senha: ${adminPassword}`);
      console.log('   ⚠️  GUARDE ESTA SENHA! Ela foi gerada automaticamente.');
    }

    console.log('\n🎉 Setup concluído!');
    console.log('📋 Próximos passos:');
    console.log('1. Execute o schema SQL no Dashboard do Supabase');
    console.log('2. Faça login com as credenciais acima');
    console.log('3. O sistema estará pronto para uso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

setupDatabase();
