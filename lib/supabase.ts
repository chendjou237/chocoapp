import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { ObjectiveResponse } from './types/objectives';

export interface Product {
  id: string;
  name: string;
  price: number;
  description:string;
  stock_quantity: number;
    created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  total: number;
  description: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function fetchUserObjectives(userId: string): Promise<ObjectiveResponse> {
  try {
    const { data, error } = await supabase
      .from('objectives')
      .select('*')
      .eq('assignee_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
