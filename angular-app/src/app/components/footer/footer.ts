import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'footer-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  tabs = [
    { href: '/vote', label: 'Vote' },
    { href: '/polls', label: 'Polls' },
  ];

  constructor(public router: Router) { }

  isActive(tabHref: string): boolean {
    const current = this.router.url;
    return current === tabHref || (tabHref === '/vote' && current === '/');
  }
}
