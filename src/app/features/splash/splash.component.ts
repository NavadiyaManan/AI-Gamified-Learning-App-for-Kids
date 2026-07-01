import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@core/services/settings.service';

@Component({
    selector: 'app-splash',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pastel-pink via-pastel-blue to-pastel-purple overflow-hidden p-6">
      <!-- Animated mascot -->
      <div class="relative mb-8 animate-bounce-slow">
        <div class="text-9xl animate-float drop-shadow-2xl select-none">🤖</div>
        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-40"></div>
      </div>

      <!-- App title -->
      <h1 class="text-5xl md:text-6xl font-black mb-4 text-center animate-slide-up drop-shadow-lg">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-light">
          TinyGenius
        </span>
      </h1>

      <!-- Tagline -->
      <p class="text-2xl font-black mb-12 text-center text-primary drop-shadow animate-slide-up" style="animation-delay: 0.1s">
        Learn, Play, Grow! 🌟
      </p>

      <!-- Decorative elements -->
      <div class="grid grid-cols-4 gap-6 mb-16 opacity-85">
        <div class="text-4xl animate-float select-none">📚</div>
        <div class="text-4xl animate-float select-none" style="animation-delay: 0.2s">🎮</div>
        <div class="text-4xl animate-float select-none" style="animation-delay: 0.4s">🏆</div>
        <div class="text-4xl animate-float select-none" style="animation-delay: 0.6s">⭐</div>
      </div>

      <!-- Start button -->
      <button
        (click)="navigateToProfiles()"
        class="btn-primary text-2xl px-12 py-5 transform hover:scale-105 active:scale-95 animate-pulse-glow"
        style="height: 70px; min-height: 70px;"
      >
        <span class="inline-block mr-2">✨</span>
        Start Learning
        <span class="inline-block ml-2">→</span>
      </button>

      <!-- Features hint -->
      <div class="mt-16 text-center text-sm text-primary font-bold opacity-80">
        <p>🎨 Colorful • 🎭 Fun • 🧠 Educational</p>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class SplashComponent implements OnInit {
    constructor(
        private router: Router,
        private settingsService: SettingsService
    ) { }

    ngOnInit(): void {
        // Voice greeting for pre-readers
        setTimeout(() => {
            if (this.settingsService.narrationEnabledValue) {
                this.speak('Welcome to Tiny Genius! Click the pink start button to learn and play!');
            }
        }, 800);
    }

    navigateToProfiles(): void {
        this.router.navigate(['/profile-selection']);
    }

    private speak(text: string): void {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.85;
            utterance.pitch = 1.3;
            
            const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
            const voiceIdx = this.settingsService.selectedVoiceIndexValue;
            if (voices.length > 0 && voiceIdx < voices.length) {
                utterance.voice = voices[voiceIdx];
            }
            window.speechSynthesis.speak(utterance);
        }
    }
}
