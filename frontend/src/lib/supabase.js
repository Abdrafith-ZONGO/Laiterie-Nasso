import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────
// Client Supabase pour le frontend
// Utilisé uniquement pour l'upload d'images
// Les données (DB) passent par le backend
// ─────────────────────────────────────────
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);