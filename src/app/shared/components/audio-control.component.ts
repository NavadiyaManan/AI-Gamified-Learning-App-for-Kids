import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '@core/services/audio.service';

@Component({
  selector: 'app-audio-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="audio-control" *ngIf="audio.volume$ | async as volume">
      <button type="button" class="audio-button" (click)="toggleMute()" [attr.aria-label]="muted ? 'Unmute sounds' : 'Mute sounds'">
        {{ muted ? 'Sound off' : 'Sound on' }}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        [ngModel]="volume"
        (ngModelChange)="audio.setVolume($event)"
        aria-label="Master volume" />
    </div>
  `,
})
export class AudioControlComponent {
  muted = false;

  constructor(public audio: AudioService) {
    this.audio.muted$.subscribe(value => this.muted = value);
  }

  toggleMute(): void {
    this.audio.toggleMute();
  }
}
