import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotService, MascotState } from '@core/services/mascot.service';
import { SettingsService } from '@core/services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-mascot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="mascot-shell" *ngIf="mascotState" aria-live="polite">
      <div class="mascot-bubble cursor-pointer" (click)="speakMessage()">
        <p class="text-sm font-black">{{ mascotState.message }}</p>
        <span class="text-[10px] text-pink-500 font-bold block mt-1">🔊 Tap to hear</span>
      </div>
      <button
        type="button"
        class="mascot-avatar"
        [class.mascot-celebrate]="mascotState.mood === 'celebrate'"
        [class.mascot-retry]="mascotState.mood === 'retry'"
        [class.mascot-thinking]="mascotState.mood === 'thinking'"
        (click)="speakMessage()"
        aria-label="AI mascot assistant">
        <span class="mascot-hand">Hi</span>
        <span class="mascot-eye left"></span>
        <span class="mascot-eye right"></span>
        <span class="mascot-smile"></span>
      </button>
    </aside>
  `,
})
export class AiMascotComponent implements OnInit, OnDestroy {
  mascotState: MascotState | null = null;
  private sub = new Subscription();

  constructor(
    public mascotService: MascotService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.mascotService.mascot$.subscribe(state => {
        const prevMessage = this.mascotState?.message;
        this.mascotState = state;

        // Auto-read message when it changes and narration is enabled
        if (state && state.message && state.message !== prevMessage && this.settingsService.narrationEnabledValue) {
          this.speak(state.message);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  speakMessage(): void {
    if (this.mascotState?.message) {
      this.speak(this.mascotState.message);
    }
  }

  private speak(text: string): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.35; // Cute kid-friendly tone
      
      const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      const voiceIdx = this.settingsService.selectedVoiceIndexValue;
      if (voices.length > 0 && voiceIdx < voices.length) {
        utterance.voice = voices[voiceIdx];
      }
      window.speechSynthesis.speak(utterance);
    }
  }
}
