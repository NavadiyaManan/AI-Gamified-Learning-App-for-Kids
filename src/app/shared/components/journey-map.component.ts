import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneyWorld } from '@core/services/gamification.service';

@Component({
  selector: 'app-journey-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="journey-map">
      <div>
        <div class="section-kicker">Learning journey</div>
        <h2>Adventure worlds</h2>
      </div>

      <div class="world-path">
        <button
          *ngFor="let world of worlds; let i = index"
          type="button"
          class="world-node"
          [class.locked]="i > unlockedIndex"
          (click)="selectWorld(world, i)">
          <span class="world-orbit"></span>
          <span class="world-badge bg-gradient-to-br {{ world.color }}">{{ world.icon }}</span>
          <span class="world-name">{{ world.name }}</span>
          <span class="world-progress">{{ world.completed }}/{{ world.total }}</span>
        </button>
      </div>
    </section>
  `,
})
export class JourneyMapComponent {
  @Input({ required: true }) worlds: JourneyWorld[] = [];
  @Input() unlockedIndex = 4;
  @Output() worldSelected = new EventEmitter<JourneyWorld>();

  selectWorld(world: JourneyWorld, index: number): void {
    if (index <= this.unlockedIndex) {
      this.worldSelected.emit(world);
    }
  }
}
