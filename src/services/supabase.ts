
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "http://192.168.1.8:54321";
// const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabaseKey = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;