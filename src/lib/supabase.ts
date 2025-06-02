import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rcowsfonthsyjlfoiqoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjb3dzZm9udGhzeWpsZm9pcW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMjM5MTMsImV4cCI6MjA2MzY5OTkxM30.FY3_Gbq7Ydj_VnS_i2Mt6jtWduqJdCf5Ycs845btr68";
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 