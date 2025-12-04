import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../../shared-backend';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: IUser | null) {
    this.userSubject.next(user);
  }

  get user() {
    return this.userSubject.getValue();
  }
}
