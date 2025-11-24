"use client";

import { createContext, useContext } from "react";
import { IAuthService } from "../shared-backend";
import { IPollService } from "../shared-backend";
import { IProfileService } from "../shared-backend";
import { IVoteService } from "../shared-backend";

export interface ServiceContextValue {
  authService: IAuthService;
  pollService: IPollService;
  profileService: IProfileService;
  voteService: IVoteService;
}

export const ServiceContext = createContext<ServiceContextValue | null>(null);

export function useServices(): ServiceContextValue {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceContext.Provider");
  }
  return context;
}
