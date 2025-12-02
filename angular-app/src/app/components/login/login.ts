import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceContext } from '../../services/service-context';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  message = '';
  loading = true;

  authService;

  constructor(private router: Router, serviceContext: ServiceContext) {
    this.authService = serviceContext.value.authService;

    this.checkUser();
  }

  async checkUser() {
    try {
      const user = await this.authService.getUser();
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
      console.log('Sending magic link to:', this.email);
      console.log('Redirect url:', environment.APP_URL);

      await this.authService.sendMagicLink(
        this.email,
        `${environment.APP_URL}/auth/callback`
      );
      this.message = 'Check your email for the login link!';
    } catch (err) {
      console.error(err);
      this.message = 'An error occurred while sending login link.';
    }
  }
}
