import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const module = { exports: {} };

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co',
  process.env.SUPABASE_API_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

// Test the connection
if (process.env.SUPABASE_URL && process.env.SUPABASE_API_KEY) {
  supabase
    .from('products')
    .select('*')
    .limit(1)
    .then(({ data, error }) => {
      if (error) console.error('Connection error:', error);
      else console.log('Connected:', data);
    });
}

module.exports = supabase;
export default supabase;
