// Script para configurar o banco de dados
// Execute com: node setup-database.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://yitrspfqpakpygfytduz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdHJzcGZxcGFrcHlnZnl0ZHV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg0OTA5OSwiZXhwIjoyMDgxNDI1MDk5fQ.5V3ex99XlHONmgPW-4M2YzwTFt4QzYIo1QZfUwZ0DRU';

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
    console.log('1. Acesse: https://supabase.com/dashboard/project/yitrspfqpakpygfytduz/sql/new');
    console.log('2. Cole o conteúdo do arquivo: supabase/schema-complete.sql');
    console.log('3. Clique em "Run" para executar\n');

    // Vamos criar um usuário de teste
    console.log('👤 Criando usuário de teste...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
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
  }
}

setupDatabase();
