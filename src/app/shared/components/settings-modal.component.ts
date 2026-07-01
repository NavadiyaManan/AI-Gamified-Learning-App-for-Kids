import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '@core/services/settings.service';
import { AudioService } from '@core/services/audio.service';
import { ParentGateComponent } from './parent-gate.component';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ParentGateComponent],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="close()">
      <div class="modal-content bg-gradient-to-br from-pastel-blue to-cyan-50 text-left max-w-md w-11/12 p-8" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-black text-primary">Settings ⚙️</h2>
          <button (click)="close()" class="btn-icon bg-gray-200 text-primary hover:bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full text-base">
            ✕
          </button>
        </div>

        <div class="space-y-6">
          <!-- Sound Volume Toggle -->
          <div class="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-soft">
            <h3 class="text-lg font-bold text-primary mb-3">🎵 Sound Volume</h3>
            <div class="flex items-center gap-4">
              <button
                (click)="toggleMute()"
                class="btn-secondary px-4 py-2 text-xs h-10 min-h-[40px] whitespace-nowrap"
              >
                {{ muted ? '🔇 Sound Off' : '🔊 Sound On' }}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                [ngModel]="volume"
                (ngModelChange)="audio.setVolume($event)"
                class="flex-1"
                aria-label="Sound volume setting"
              />
            </div>
          </div>

          <!-- TTS Narration -->
          <div class="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-soft">
            <h3 class="text-lg font-bold text-primary mb-3">🗣️ Read Instructions Aloud</h3>
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-slate-500">Enable voice guidance</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [ngModel]="narrationEnabled"
                  (ngModelChange)="toggleNarration($event)"
                  class="sr-only peer"
                  aria-label="Enable voice guidance"
                />
                <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>

            <!-- Voice Selector (only visible if narration is enabled) -->
            <div class="mt-4" *ngIf="narrationEnabled">
              <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Voice Style:</label>
              <select
                [(ngModel)]="selectedVoiceIndex"
                (change)="onVoiceChanged()"
                class="w-full px-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-secondary font-bold text-sm"
              >
                <option *ngFor="let voice of availableVoices; let i = index" [value]="i">
                  {{ voice.name }} ({{ voice.lang }})
                </option>
              </select>
            </div>
          </div>

          <!-- Reduce Motion Accessibility Toggle -->
          <div class="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-soft">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-bold text-primary">♿ Reduce Motion</h3>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [ngModel]="reduceMotion"
                  (ngModelChange)="toggleReduceMotion($event)"
                  class="sr-only peer"
                  aria-label="Reduce motion settings"
                />
                <div class="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
            <p class="text-xs font-semibold text-slate-500">
              Disables all wiggles, floats, bouncing, and sliding effects for a calmer interface.
            </p>
          </div>

          <!-- Parent Dashboard Link Gated -->
          <button
            type="button"
            (click)="requestParentDashboard()"
            class="btn-secondary w-full py-4 text-center"
          >
            👨‍👩‍👧‍👦 Parent Dashboard (Gate)
          </button>
        </div>
      </div>
    </div>

    <!-- Parent Gate -->
    <app-parent-gate
      #parentGate
      (verified)="onParentGateVerified()"
    ></app-parent-gate>
  `,
  styles: [`
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      height: 8px;
      border-radius: 9999px;
      background: #ffe4e6;
      outline: none;
      cursor: pointer;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #FF1493;
      border: 2px solid white;
    }
  `]
})
export class SettingsModalComponent implements OnInit {
  @ViewChild('parentGate') parentGate!: ParentGateComponent;

  isOpen = false;
  reduceMotion = false;
  narrationEnabled = true;
  selectedVoiceIndex = 0;
  volume = 0.55;
  muted = false;
  availableVoices: SpeechSynthesisVoice[] = [];

  constructor(
    private settingsService: SettingsService,
    public audio: AudioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.settingsService.reduceMotion$.subscribe(val => this.reduceMotion = val);
    this.settingsService.narrationEnabled$.subscribe(val => this.narrationEnabled = val);
    this.settingsService.selectedVoiceIndex$.subscribe(val => this.selectedVoiceIndex = val);
    this.audio.volume$.subscribe(val => this.volume = val);
    this.audio.muted$.subscribe(val => this.muted = val);
    this.loadAvailableVoices();
  }

  loadAvailableVoices(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      this.availableVoices = voices.filter(v => v.lang.startsWith('en'));
      if (this.availableVoices.length === 0) {
        this.availableVoices = voices;
      }
    }
  }

  open(): void {
    this.loadAvailableVoices();
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  toggleMute(): void {
    this.audio.toggleMute();
  }

  toggleNarration(enabled: boolean): void {
    this.settingsService.setNarrationEnabled(enabled);
  }

  toggleReduceMotion(enabled: boolean): void {
    this.settingsService.setReduceMotion(enabled);
  }

  onVoiceChanged(): void {
    this.settingsService.setSelectedVoiceIndex(Number(this.selectedVoiceIndex));
  }

  requestParentDashboard(): void {
    this.parentGate.open();
  }

  onParentGateVerified(): void {
    this.isOpen = false;
    this.router.navigate(['/parent-dashboard']);
  }
}
