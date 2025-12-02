// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Callback } from './auth-callback/callback';

import { LoginComponent } from './components/login/login';
import { PollsPage } from './polls/polls';
import { VotePage } from './vote/vote';
import { ProtectedLayoutComponent } from './components/protected-layout/protected-layout';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: Callback },
  {
    path: '',
    component: ProtectedLayoutComponent,
    children: [
      { path: '', redirectTo: 'polls', pathMatch: 'full' },
      { path: 'vote', component: VotePage },
      { path: 'polls', component: PollsPage },
    ]
  },
];
