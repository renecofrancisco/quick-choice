import { BackendType } from "./backendTypes";
import { createSupabaseServices, createExpressServices, createGraphQLServices } from "../shared-backend";

export function createServicesByType(type: BackendType) {
  switch (type) {
    case BackendType.Supabase:
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      return createSupabaseServices(supabaseUrl, supabaseAnonKey);

    case BackendType.Express:
      const expressApiUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL!;
      return createExpressServices(expressApiUrl);

    case BackendType.GraphQL:
      const graphqlApiUrl = process.env.NEXT_PUBLIC_GRAPHQL_API_URL!;
      return createGraphQLServices(graphqlApiUrl);

    default:
      throw new Error("Invalid backend type. Must be Supabase or Express.");
  }
}
