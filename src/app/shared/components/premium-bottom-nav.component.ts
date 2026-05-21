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
        (click)="audio.play('tap')"
        class="dock-item"
        [class.active]="router.url === item.route"
        [attr.aria-label]="item.label">
        <span class="dock-icon">{{ item.icon }}</span>
        <span class="dock-label">{{ item.label }}</span>
      </a>
    </nav>
  `,
})
export class PremiumBottomNavComponent {
  items = [
    { label: 'Home', icon: 'Home', route: '/dashboard' },
    { label: 'Map', icon: 'Map', route: '/dashboard' },
    { label: 'Puzzle', icon: 'Puzzle', route: '/puzzle' },
    { label: 'Rewards', icon: 'Star', route: '/rewards' },
    { label: 'Profile', icon: 'You', route: '/profile-selection' },
  ];

  constructor(public router: Router, public audio: AudioService) {}
}
