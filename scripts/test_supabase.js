import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load directly from .env file since process.env might not auto-populate in raw script
const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase keys in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
  'lfe_settings',
  'lfe_teams',
  'lfe_athletes',
  'lfe_games',
  'lfe_registrations',
  'lfe_banners',
  'lfe_sponsors',
  'lfe_gallery',
  'lfe_technical_documents'
];

async function checkTables() {
  console.log('Verificando conexão com Supabase...');
  let successCount = 0;
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`❌ Tabela [${table}] - Erro: ${error.message} (Código: ${error.code})`);
    } else {
      console.log(`✅ Tabela [${table}] - OK!`);
      successCount++;
    }
  }
  
  console.log(`\nResultado: ${successCount}/${tables.length} tabelas estão funcionando corretamente.`);
}

checkTables();
