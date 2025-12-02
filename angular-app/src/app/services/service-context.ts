import { Injectable } from '@angular/core';
import { IAuthService, IPollService, IProfileService, IVoteService } from '../../../shared-backend';
import { createServicesByType } from './service-factory';
import { BackendType } from './backend-types';

export interface ServiceContextValue {
  authService: IAuthService;
  pollService: IPollService;
  profileService: IProfileService;
  voteService: IVoteService;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceContext {
  private readonly services: ServiceContextValue;

  constructor() {
    this.services = createServicesByType(BackendType.Supabase);
  }

  get value(): ServiceContextValue {
    return this.services;
  }
}
