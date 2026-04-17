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

async function syncCheck() {
  console.log('--- SYNC CHECK ---');
  const { data: teams } = await supabase.from('lfe_teams').select('id, name');
  const { data: games } = await supabase.from('lfe_games').select('id, home_team_id, away_team_id, status');
  
  console.log('Total Teams:', teams?.length || 0);
  console.log('Total Games:', games?.length || 0);
  
  if (games && teams) {
    games.forEach(g => {
      const homeMatch = teams.find(t => String(t.id) === String(g.home_team_id));
      const awayMatch = teams.find(t => String(t.id) === String(g.away_team_id));
      console.log(`Game ${g.id}: Home(${g.home_team_id}) -> ${homeMatch?.name || 'MISSING'} | Away(${g.away_team_id}) -> ${awayMatch?.name || 'MISSING'}`);
    });
  }
}

syncCheck();
