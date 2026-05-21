import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '@core/services/data.service';
import { AudioService } from '@core/services/audio.service';
import { MascotService } from '@core/services/mascot.service';
import { Alphabet } from '@core/models';

@Component({
    selector: 'app-alphabet',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-pink pb-24 md:pb-12">
      <!-- Header -->
      <div class="bg-gradient-to-r from-secondary to-primary p-6 md:p-8 shadow-soft-lg">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl md:text-4xl font-bold text-white">Learn Alphabets! 🔤</h1>
            <button (click)="goBack()" class="btn-icon bg-white text-secondary hover:bg-gray-100">
              ✕
            </button>
          </div>
          <!-- Voice Selector -->
          <div class="flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur rounded-xl p-4">
            <label class="text-white font-bold text-sm md:text-base">🔊 Choose Voice:</label>
            <select
              [(ngModel)]="selectedVoiceIndex"
              (change)="onVoiceChanged()"
              class="px-4 py-2 rounded-lg border-2 border-white bg-white text-secondary font-bold cursor-pointer focus:outline-none"
            >
              <option *ngFor="let voice of availableVoices; let i = index" [value]="i">
                {{ getVoiceName(voice) }}
              </option>
            </select>
            <button
              (click)="playVoiceDemo()"
              class="btn-secondary px-4 py-2 text-sm whitespace-nowrap"
            >
              🔊 Test Voice
            </button>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-4xl mx-auto px-6 md:px-8 py-8">
        <!-- Progress indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-bold text-primary">Progress: {{ currentIndex + 1 }}/{{ alphabets.length }}</p>
            <p class="text-sm font-bold text-secondary">{{ ((currentIndex + 1) / alphabets.length * 100).toFixed(0) }}%</p>
          </div>
          <div class="bg-white rounded-full h-3 overflow-hidden shadow-soft">
            <div
              class="bg-gradient-to-r from-secondary to-primary h-full animate-pulse-glow transition-all duration-500"
              [style.width.%]="((currentIndex + 1) / alphabets.length * 100)"
            ></div>
          </div>
        </div>

        <!-- Main alphabet card -->
        <div class="card-floating p-12 mb-8 text-center shadow-soft-lg transform animate-scale-up">
          <!-- Example image/emoji -->
          <div class="text-7xl mb-8 animate-float drop-shadow-lg">
            {{ currentAlphabet?.exampleImage }}
          </div>

          <!-- Pronunciation guide -->
          <div class="bg-gradient-to-r from-pastel-yellow to-yellow-50 rounded-2xl p-6 mb-8 border-4 border-accent-yellow">
            <p class="text-sm text-gray-600 font-semibold mb-2">HOW TO SAY IT:</p>
            <p class="text-3xl font-bold text-primary">{{ currentAlphabet?.pronunciation }}</p>
          </div>

          <!-- Main letter -->
          <div class="mb-8">
            <div class="text-9xl font-bold bg-gradient-to-br from-secondary to-primary text-transparent bg-clip-text animate-pulse drop-shadow-lg">
              {{ currentAlphabet?.letter }}
            </div>
          </div>

          <!-- Example word -->
          <div class="bg-white rounded-2xl p-6 mb-8 shadow-soft">
            <p class="text-sm text-gray-600 font-semibold mb-2">EXAMPLE WORD:</p>
            <p class="text-3xl font-bold text-primary">{{ currentAlphabet?.exampleWord }}</p>
            <!-- Play example word sound button -->
            <button
              (click)="speakWord(currentAlphabet?.exampleWord)"
              class="btn-secondary px-6 py-2 text-sm mt-3"
            >
              🔊 Hear "{{ currentAlphabet?.exampleWord }}"
            </button>
          </div>

          <!-- Voice button -->
          <button
            (click)="playSound()"
            class="btn-primary px-10 py-4 text-lg transform hover:scale-110 active:scale-95 animate-bounce-slow"
          >
            🔊 Hear the Sound
          </button>
        </div>

        <!-- Learning tips -->
        <div class="card-floating p-6 mb-8 bg-gradient-to-r from-pastel-green to-green-50">
          <h3 class="text-lg font-bold text-primary mb-3">💡 Learning Tip</h3>
          <p class="text-secondary font-semibold">
            Try to pronounce the letter and the example word together: "{{ currentAlphabet?.pronunciation }} for {{ currentAlphabet?.exampleWord }}"
          </p>
        </div>

        <!-- Navigation buttons -->
        <div class="grid grid-cols-2 gap-4 md:flex md:gap-6 md:justify-between">
          <button
            (click)="previousAlphabet()"
            [disabled]="currentIndex === 0"
            [class.opacity-50]="currentIndex === 0"
            [class.cursor-not-allowed]="currentIndex === 0"
            class="btn-secondary px-6 py-3 transform hover:scale-110 active:scale-95"
          >
            ← Previous
          </button>

          <button
            (click)="skipAlphabet()"
            class="btn-icon bg-gradient-to-r from-accent-yellow to-yellow-400 text-white transform hover:scale-110 active:scale-95"
          >
            ⊙
          </button>

          <button
            (click)="nextAlphabet()"
            [disabled]="currentIndex === alphabets.length - 1"
            [class.opacity-50]="currentIndex === alphabets.length - 1"
            [class.cursor-not-allowed]="currentIndex === alphabets.length - 1"
            class="btn-primary px-6 py-3 transform hover:scale-110 active:scale-95"
          >
            Next →
          </button>
        </div>

        <!-- Done learning -->
        <div *ngIf="currentIndex === alphabets.length - 1" class="mt-8 text-center">
          <p class="text-xl font-bold text-primary mb-4">Great job! You've learned all alphabets! 🎉</p>
          <button
            (click)="completeLearning()"
            class="btn-primary px-8 py-4 text-lg"
          >
            ✨ Earn Reward & Go Back
          </button>
        </div>
      </div>

      <!-- Celebration popup -->
      <div
        *ngIf="showCelebration"
        class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div class="text-6xl animate-bounce-slow">
          🎉
        </div>
        <div class="text-6xl animate-bounce-slow" style="animation-delay: 0.2s">
          ⭐
        </div>
        <div class="text-6xl animate-bounce-slow" style="animation-delay: 0.4s">
          🎊
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class AlphabetComponent implements OnInit {
    alphabets: Alphabet[] = [];
    currentIndex: number = 0;
    currentAlphabet: Alphabet | null = null;
    showCelebration: boolean = false;

    // Voice selection properties
    availableVoices: SpeechSynthesisVoice[] = [];
    selectedVoiceIndex: number = 0;

    constructor(
        private dataService: DataService,
        private router: Router,
        private audio: AudioService,
        private mascot: MascotService
    ) { }

    ngOnInit(): void {
        this.alphabets = this.dataService.getAlphabets();
        if (this.alphabets.length > 0) {
            this.currentAlphabet = this.alphabets[0];
        }
        this.loadAvailableVoices();
    }

    loadAvailableVoices(): void {
        const voices = window.speechSynthesis.getVoices();
        this.availableVoices = voices.filter(voice => voice.lang.startsWith('en'));
        if (this.availableVoices.length === 0) {
            this.availableVoices = voices;
        }
        // Set default voice
        if (this.availableVoices.length > 0) {
            this.selectedVoiceIndex = 0;
        }
    }

    getVoiceName(voice: SpeechSynthesisVoice): string {
        return `${voice.name}${voice.default ? ' (Default)' : ''}`;
    }

    onVoiceChanged(): void {
        // Voice index has been updated via ngModel
    }

    playVoiceDemo(): void {
        this.speak('Alphabet learning is fun!');
    }

    nextAlphabet(): void {
        if (this.currentIndex < this.alphabets.length - 1) {
            this.currentIndex++;
            this.currentAlphabet = this.alphabets[this.currentIndex];
            this.showCelebration = false;
        }
    }

    previousAlphabet(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.currentAlphabet = this.alphabets[this.currentIndex];
            this.showCelebration = false;
        }
    }

    skipAlphabet(): void {
        this.showCelebration = true;
        this.audio.play('swipe');
        this.mascot.encourage('Nice exploring! Keep going.');
        setTimeout(() => {
            this.showCelebration = false;
            this.nextAlphabet();
        }, 800);
    }

    playSound(): void {
        if (this.currentAlphabet) {
            this.speak(this.currentAlphabet.pronunciation);
        }
    }

    speakWord(word: string | undefined): void {
        if (word) {
            this.speak(word);
        }
    }

    speak(text: string): void {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8; // Slower speech for kids
        utterance.pitch = 1.2; // Slightly higher pitch
        utterance.volume = 1;

        // Use selected voice
        if (this.availableVoices.length > 0 && this.selectedVoiceIndex < this.availableVoices.length) {
            utterance.voice = this.availableVoices[this.selectedVoiceIndex];
        }

        window.speechSynthesis.speak(utterance);
    }

    completeLearning(): void {
        this.showCelebration = true;
        const child = this.dataService.getCurrentChild();
        if (child) {
            this.dataService.updateChildProgress(child.id, 'alphabets', 35);
        }
        this.audio.play('levelUp');
        this.mascot.celebrate('Amazing job! Alphabet star unlocked!');
        setTimeout(() => {
            this.router.navigate(['/dashboard']);
        }, 2000);
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}
