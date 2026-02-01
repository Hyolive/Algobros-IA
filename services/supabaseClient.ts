
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Utilise les variables d'environnement Vercel si disponibles, sinon utilise les clés par défaut
const supabaseUrl = process.env.SUPABASE_URL || 'https://urtmzpffwpjbukyweign.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_rflB9UgllVhIUBgnCtQmfQ_vm0yBmzX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
