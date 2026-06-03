import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AudioService } from '@core/services/audio.service';

@Component({
  selector: 'app-premium-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="premium-dock" aria-label="Primary">
      <a *ngFor="let item of items"
        [routerLink]="item.route"
        [queryParams]="item.queryParams"
        (click)="audio.play('tap')"
        class="dock-item"
        [class.active]="isActive(item)"
        [attr.aria-label]="item.label">
        <span class="dock-icon">{{ item.icon }}</span>
        <span class="dock-label">{{ item.label }}</span>
      </a>
    </nav>
  `,
})
export class PremiumBottomNavComponent {
  items = [
    { label: 'Home', icon: 'Home', route: '/dashboard', queryParams: { tab: 'home' } },
    { label: 'Map', icon: 'Map', route: '/dashboard', queryParams: { tab: 'map' } },
    { label: 'Puzzle', icon: 'Puzzle', route: '/puzzle', queryParams: null },
    { label: 'Rewards', icon: 'Star', route: '/rewards', queryParams: null },
    { label: 'Profile', icon: 'You', route: '/profile-selection', queryParams: null },
  ];

  constructor(public router: Router, public audio: AudioService) {}

  isActive(item: any): boolean {
    if (item.queryParams && item.queryParams.tab) {
      if (item.queryParams.tab === 'home') {
        return this.router.url === '/dashboard' || this.router.url.startsWith('/dashboard?tab=home');
      }
      return this.router.url.startsWith(`/dashboard?tab=${item.queryParams.tab}`);
    }
    return this.router.url.startsWith(item.route) && !this.router.url.includes('/dashboard');
  }
}
