import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotService } from '@core/services/mascot.service';

@Component({
  selector: 'app-ai-mascot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="mascot-shell" *ngIf="mascotService.mascot$ | async as mascot" aria-live="polite">
      <div class="mascot-bubble">
        <p>{{ mascot.message }}</p>
      </div>
      <button
        type="button"
        class="mascot-avatar"
        [class.mascot-celebrate]="mascot.mood === 'celebrate'"
        [class.mascot-retry]="mascot.mood === 'retry'"
        [class.mascot-thinking]="mascot.mood === 'thinking'"
        aria-label="AI mascot assistant">
        <span class="mascot-hand">Hi</span>
        <span class="mascot-eye left"></span>
        <span class="mascot-eye right"></span>
        <span class="mascot-smile"></span>
      </button>
    </aside>
  `,
})
export class AiMascotComponent {
  constructor(public mascotService: MascotService) {}
}
