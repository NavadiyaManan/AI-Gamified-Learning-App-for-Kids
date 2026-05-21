import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ambient-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ambient-world" aria-hidden="true">
      <span *ngFor="let item of decorations; let i = index"
        class="ambient-item"
        [style.left.%]="item.left"
        [style.top.%]="item.top"
        [style.animationDelay.s]="i * 0.55"
        [style.animationDuration.s]="item.duration">
        {{ item.label }}
      </span>
    </div>
  `,
})
export class AmbientBackgroundComponent {
  decorations = [
    { label: '+', left: 8, top: 18, duration: 9 },
    { label: 'A', left: 18, top: 64, duration: 11 },
    { label: '*', left: 32, top: 12, duration: 10 },
    { label: '7', left: 48, top: 78, duration: 12 },
    { label: 'oo', left: 64, top: 22, duration: 13 },
    { label: '*', left: 76, top: 58, duration: 9 },
    { label: 'B', left: 88, top: 28, duration: 12 },
  ];
}
