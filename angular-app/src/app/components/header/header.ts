import { Component, ElementRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceContext } from '../../services/service-context';
import { BackendType } from '../../services/backend-types';
import { environment } from '../../../environments/environment';
import { AuthState } from '../../utils/auth-state';
import { broadcastAuthStateChangeEvent } from '../../utils/auth-events';

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

  constructor(private elementRef: ElementRef, serviceContext: ServiceContext, private authState: AuthState, private cd: ChangeDetectorRef) {
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
    const user = this.authState.user;
    if (!user) return;

    try {
      const profile = await this.profileService.getUserProfile(user.id);
      this.credits = profile?.credits ?? 0;
    } catch (err) {
      console.error('Error fetching credits:', err);
      this.credits = 0;
    } finally {
      this.cd.detectChanges();
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  async handleLogout() {
    await this.authService.signOut();
    broadcastAuthStateChangeEvent();
    window.location.href = '/';
  }

  handleClickOutside = (event: MouseEvent) => {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showProfileMenu = false;
    }
  };
}
