"use client";

import { ReactNode, useMemo } from "react";
import { ServiceContext } from "./ServiceContext";
import { createSupabaseServices, createExpressServices } from "shared-backend";
import { supabaseClient } from "../lib/supabase";

export function ServiceProvider({ children }: { children: ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const services = createSupabaseServices(supabaseUrl, supabaseAnonKey); //Use supabase services
  // const services = createExpressServices(process.env.NEXT_PUBLIC_EXPRESS_API_URL!); //Use express services
  const memoServices = useMemo(() => services, []);

  return (
    <ServiceContext.Provider value={memoServices}>
      {children}
    </ServiceContext.Provider>
  );
}
