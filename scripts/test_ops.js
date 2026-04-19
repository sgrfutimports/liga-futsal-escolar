import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testOperations() {
  console.log('Testando OPERAÇÕES no projeto:', supabaseUrl);
  
  // Test Insert
  const { data: insData, error: insErr } = await supabase.from('lfe_games').insert([{
    category: 'TESTE',
    status: 'Agendado'
  }]).select();
  
  if (insErr) {
    console.error('❌ Erro no INSERT:', insErr.message, insErr.code);
  } else {
    console.log('✅ INSERT OK! ID:', insData[0].id);
    
    // Test Delete
    const { error: delErr } = await supabase.from('lfe_games').delete().eq('id', insData[0].id);
    if (delErr) {
      console.error('❌ Erro no DELETE:', delErr.message, delErr.code);
    } else {
      console.log('✅ DELETE OK!');
    }
  }
}

testOperations();
