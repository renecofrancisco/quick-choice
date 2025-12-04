// src/app/auth/callback/callback.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceContext } from '../services/service-context';
import { broadcastAuthStateChangeEvent } from '../utils/auth-events';
import { AuthState } from '../utils/auth-state';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `<div>Signing you in…</div>`,
  imports: [], // add CommonModule if you use *ngIf or *ngFor
})
export class Callback implements OnInit {
  authService;

  constructor(private router: Router, serviceContext: ServiceContext, private authState: AuthState) {
    this.authService = serviceContext.value.authService;
  }

  ngOnInit(): void {
    (async () => {
      try {
        await this.authService.restoreFromUrlTokens(window.location.hash);
        const user = await this.authService.getUser();
        if (user) broadcastAuthStateChangeEvent();
        this.authState.setUser(user);
        this.router.navigate(['/']);
      } catch (err) {
        console.error(err);
        this.router.navigate(['/']);
      }
    })();
  }
}
