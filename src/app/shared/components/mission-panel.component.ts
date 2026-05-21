import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mission } from '@core/services/gamification.service';

@Component({
  selector: 'app-mission-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mission-panel">
      <div class="section-kicker">Daily missions</div>
      <div class="mission-grid">
        <article *ngFor="let mission of missions" class="mission-card" [class.complete]="mission.claimed">
          <div class="mission-icon">{{ mission.icon }}</div>
          <div class="min-w-0">
            <h3>{{ mission.title }}</h3>
            <p>{{ mission.reward }} XP reward</p>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="(mission.progress / mission.total) * 100"></div>
            </div>
          </div>
          <button type="button" [disabled]="!mission.claimed">{{ mission.claimed ? 'Claim' : mission.progress + '/' + mission.total }}</button>
        </article>
      </div>
    </section>
  `,
})
export class MissionPanelComponent {
  @Input({ required: true }) missions: Mission[] = [];
}
