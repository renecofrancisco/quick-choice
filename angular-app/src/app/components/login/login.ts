import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceContext } from '../../services/service-context';
import { environment } from '../../../environments/environment';
import { IAuthService } from '../../../../shared-backend';
import { AuthState } from '../../utils/auth-state';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  message = '';
  loading = true;

  authService: IAuthService;

  constructor(private router: Router, serviceContext: ServiceContext, private authState: AuthState, private cd: ChangeDetectorRef) {
    this.authService = serviceContext.value.authService;

    this.checkUser();
  }

  async checkUser() {
    try {
      const user = this.authState.user;
      if (user) {
        this.router.navigate(['/']); // redirect if logged in
      } else {
        this.loading = false; // show login form
      }
    } catch (err) {
      console.error(err);
      this.loading = false;
    }
  }

  async handleLogin() {
    try {
      const result = await this.authService.sendMagicLink(
        this.email,
        `${environment.APP_URL}/auth/callback`
      );
      this.message = 'Check your email for the login link!';
      this.cd.detectChanges();

    } catch (err) {
      this.message = 'An error occurred while sending login link.';
      console.error(err);
    }
  }
}
