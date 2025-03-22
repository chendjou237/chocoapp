import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const supabaseUrl = 'https://sqyxirmcfkynnbggyqcl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeXhpcm1jZmt5bm5iZ2d5cWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDUxMTEsImV4cCI6MjA1Nzk4MTExMX0.sjXd_ORUwKzu6pv6KcpuHUPnpjzT-vIiewpgFnyk0ks';

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
