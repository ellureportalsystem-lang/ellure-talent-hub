import { supabase } from './supabase';

/**
 * Test the Supabase connection
 * This function can be called to verify that the Supabase client is properly configured
 */
export async function testSupabaseConnection() {
  try {
    // Test connection by fetching from a public table or checking auth
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful!');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}















