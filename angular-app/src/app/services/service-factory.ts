import { BackendType } from './backend-types';
import { createSupabaseServices, createExpressServices } from '../../../shared-backend';
import { environment } from '../../environments/environment';

export function createServicesByType(type: BackendType) {
  switch (type) {
    case BackendType.Supabase: {
      const supabaseUrl = environment.SUPABASE_URL || '';
      const supabaseAnonKey = environment.SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL or ANON KEY not set in environment');
      }
      return createSupabaseServices(supabaseUrl, supabaseAnonKey);
    }

    case BackendType.Express: {
      const apiUrl = environment.EXPRESS_API_URL || '';
      if (!apiUrl) {
        throw new Error('Express API URL not set in environment');
      }
      return createExpressServices(apiUrl);
    }

    default:
      throw new Error('Invalid backend type. Must be Supabase or Express.');
  }
}
