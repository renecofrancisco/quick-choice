"use client";

import { ReactNode, useMemo } from "react";
import { ServiceContext } from "./ServiceContext";
import { createServices } from "../services/createServices";

export function ServiceProvider({ children }: { children: ReactNode }) {
  const services = useMemo(() => createServices(), []);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}
