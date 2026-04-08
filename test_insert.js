import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const data = {
    name: 'COLÉGIO DIOCESANO DE GARANHUNS',
    city: 'GARANHUNS',
    categories: ['SUB-11', 'SUB-12', 'SUB-13', 'SUB-14', 'SUB-15'],
    logo: ''
  };
  
  console.log("Tentando upsert com array...");
  const { data: result, error } = await supabase.from('lfe_teams').upsert(data).select();
  if (error) {
    console.error("ERRO:", error);
  } else {
    console.log("SUCESSO:", result);
  }
}

testInsert();
