"use client";

import { createContext, useContext } from "react";
import { IAuthService } from "../interfaces/IAuthService";
import { IPollService } from "../interfaces/IPollService";
import { IProfileService } from "../interfaces/IProfileService";
import { IVoteService } from "../interfaces/IVoteService";

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
