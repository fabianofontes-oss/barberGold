/* eslint-disable @typescript-eslint/no-require-imports */
// Script para configurar o banco de dados
// Execute com: node setup-database.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Tentar carregar variáveis de ambiente de .env.local ou .env
function loadEnv() {
  const envFiles = ['.env.local', '.env'];

  for (const file of envFiles) {
    const envPath = path.join(__dirname, file);
    if (fs.existsSync(envPath)) {
      console.log(`📄 Carregando variáveis de ambiente de ${file}...`);
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yitrspfqpakpygfytduz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ ERRO CRÍTICO: SUPABASE_SERVICE_ROLE_KEY não encontrada.');
  console.error('Por favor, defina a variável de ambiente SUPABASE_SERVICE_ROLE_KEY em .env.local ou exporte-a no terminal.');
  console.error('Exemplo: export SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados...\n');

  try {
    // Ler o schema SQL
    const schemaPath = path.join(__dirname, 'supabase', 'schema-complete.sql');
    if (!fs.existsSync(schemaPath)) {
        throw new Error(`Arquivo de schema não encontrado: ${schemaPath}`);
    }
    // const schema = fs.readFileSync(schemaPath, 'utf8'); // Unused
    
    console.log('📝 Schema carregado, executando no banco...');
    
    // Para executar SQL direto, você precisa fazer via Dashboard do Supabase
    console.log('\n⚠️  IMPORTANTE:');
    console.log('1. Acesse: https://supabase.com/dashboard/project/yitrspfqpakpygfytduz/sql/new');
    console.log('2. Cole o conteúdo do arquivo: supabase/schema-complete.sql');
    console.log('3. Clique em "Run" para executar\n');

    // Vamos criar um usuário de teste
    console.log('👤 Criando usuário de teste...');
    const { error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@barbergold.com',
      password: 'Admin123!',
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
      console.log('   Email: admin@barbergold.com');
      console.log('   Senha: Admin123!');
    }

    console.log('\n🎉 Setup concluído!');
    console.log('📋 Próximos passos:');
    console.log('1. Execute o schema SQL no Dashboard do Supabase');
    console.log('2. Faça login com as credenciais acima');
    console.log('3. O sistema estará pronto para uso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

setupDatabase();
