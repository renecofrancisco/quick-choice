"use client";

import { ReactNode, useMemo } from "react";
import { ServiceContext } from "./ServiceContext";
import { BackendType } from "./backendTypes";
import { createServicesByType } from "./ServiceFactory";

interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const backendTypeEnv = Number(process.env.NEXT_PUBLIC_BACKEND_TYPE);
  const backendType = backendTypeEnv as BackendType;

  const services = useMemo(() => createServicesByType(backendType), [backendType]);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}
