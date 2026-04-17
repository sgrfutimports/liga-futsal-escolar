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

async function checkGames() {
  console.log('Projeto:', supabaseUrl);
  const { data, error } = await supabase.from('lfe_games').select('*');
  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Jogos encontrados:', data.length);
    data.forEach(g => console.log(`- ID: ${g.id} | ${g.date} | ${g.status}`));
  }
}

checkGames();
