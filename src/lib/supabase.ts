
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import { SUPABASE_URL, SUPABASE_KEY } from '@env';
import 'react-native-url-polyfill/auto'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = SUPABASE_KEY || '';


console.log(supabaseUrl, supabaseAnonKey);

export const supabase = createClient<Database>(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6d29waXFtdm5leXJ0eWJjeWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMDM3ODAsImV4cCI6MjA0Nzg3OTc4MH0.iygtE8i8izhy37i96HQwUw0XOYvz4yH74THeDgf7wJc', {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
