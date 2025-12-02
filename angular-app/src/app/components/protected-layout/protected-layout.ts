import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { ServiceContext } from '../../services/service-context';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'protected-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './protected-layout.html',
  styleUrl: './protected-layout.css',
})
export class ProtectedLayoutComponent implements OnInit, OnDestroy {
  user: any = null;
  loading = false;

  publicPaths = ['/auth/callback'];
  currentPath = '/';

  authService;

  constructor(private router: Router,
    serviceContext: ServiceContext
  ) {
    this.authService = serviceContext.value.authService;
  }

  ngOnInit(): void {
    // Load initial user
    this.loadUser();

    // Listen for login/logout from other tabs
    window.addEventListener('storage', this.handleStorage);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorage);
  }

  private handleStorage = (event: StorageEvent) => {
    if (event.key === 'AUTH_STATE_CHANGED') {
      this.loadUser();
    }
  };

  async loadUser() {
    this.loading = true;

    try {
      this.user = await this.authService.getUser();
    } catch {
      this.user = null;
    }

    this.loading = false;

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
  }

  isPublicRoute(): boolean {
    return this.publicPaths.includes(this.currentPath);
  }
}
