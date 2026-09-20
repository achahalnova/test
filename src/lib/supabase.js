import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://efzoblgsjqbrnfspbwrj.supabase.co';
const supabaseKey = 'sb_publishable_3AeKiSqH7xQJ6DDjlbKEKg_D5RUq2fl';

export const supabase = createClient(supabaseUrl, supabaseKey);
