import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceContext } from '../../services/service-context';
import { BackendType } from '../../services/backend-types';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  credits: number | null = null;
  showProfileMenu = false;

  backendType: BackendType;
  backendTypeLabel: string;

  authService;
  profileService;

  constructor(private elementRef: ElementRef, serviceContext: ServiceContext) {
    const backendTypeEnv = Number(
      environment.BACKEND_TYPE ?? 0
    );
    this.backendType = backendTypeEnv as BackendType;
    this.backendTypeLabel = BackendType[this.backendType];

    this.authService = serviceContext.value.authService;
    this.profileService = serviceContext.value.profileService;
  }

  ngOnInit(): void {
    this.fetchCredits();
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  async fetchCredits() {
    const user = await this.authService.getUser();
    if (!user) return;

    try {
      const profile = await this.profileService.getUserProfile(user.id);
      this.credits = profile?.credits ?? 0;
    } catch (err) {
      console.error('Error fetching credits:', err);
      this.credits = 0;
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  async handleLogout() {
    await this.authService.signOut();
    localStorage.setItem('AUTH_STATE_CHANGED', Date.now().toString());
    window.location.href = '/';
  }

  handleClickOutside = (event: MouseEvent) => {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showProfileMenu = false;
    }
  };
}
