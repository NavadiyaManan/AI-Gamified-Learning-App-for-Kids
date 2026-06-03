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
    <div class="min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-pink pb-32">
      <!-- Floating Header Card -->
      <header class="px-5 pt-8 md:px-10">
        <div class="mx-auto max-w-4xl">
          <div class="card-floating p-6 md:p-8 flex flex-col gap-4 relative">
            <button (click)="goBack()" 
              class="absolute right-6 top-6 btn-icon bg-slate-100 text-primary hover:bg-slate-200 w-10 h-10 flex items-center justify-center rounded-full text-base font-black">
              ✕
            </button>
            <div>
              <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">SPEECH QUEST</p>
              <h1 class="text-3xl md:text-4xl font-black text-pink-500">Learn Alphabets! 🔤</h1>
            </div>
            <!-- Voice Selector -->
            <div class="flex flex-wrap items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-2">
              <label class="text-slate-600 font-black text-xs uppercase tracking-wider">🔊 Choose Voice:</label>
              <select
                [(ngModel)]="selectedVoiceIndex"
                (change)="onVoiceChanged()"
                class="px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-secondary font-bold cursor-pointer focus:outline-none text-sm"
              >
                <option *ngFor="let voice of availableVoices; let i = index" [value]="i">
                  {{ getVoiceName(voice) }}
                </option>
              </select>
              <button
                (click)="playVoiceDemo()"
                class="btn-secondary px-4 py-2 text-xs rounded-xl"
              >
                🔊 Test Voice
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <div class="max-w-4xl mx-auto px-5 py-8 md:px-10">
        <!-- Progress indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs uppercase tracking-widest font-black text-pink-500">Progress: {{ currentIndex + 1 }}/{{ alphabets.length }}</p>
            <p class="text-sm font-black text-cyan-500">{{ ((currentIndex + 1) / alphabets.length * 100).toFixed(0) }}%</p>
          </div>
          <div class="bg-slate-100 rounded-full h-5 overflow-hidden border-2 border-white shadow-inner relative">
            <div
              class="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 animated-xp transition-all duration-500"
              [style.width.%]="((currentIndex + 1) / alphabets.length * 100)"
            ></div>
          </div>
        </div>

        <!-- Main alphabet card -->
        <div class="card-floating p-8 md:p-12 mb-8 text-center shadow-soft-lg transform animate-scale-up">
          <!-- Example image/emoji -->
          <div class="text-8xl mb-6 animate-float drop-shadow-lg select-none">
            {{ currentAlphabet?.exampleImage }}
          </div>

          <!-- Pronunciation guide -->
          <div class="bg-gradient-to-r from-amber-100 to-amber-50 rounded-[2rem] p-6 mb-8 border-4 border-amber-300">
            <p class="text-xs font-black uppercase text-amber-600 tracking-wider mb-2">How to say it</p>
            <p class="text-4xl font-black text-pink-600 font-fredoka">{{ currentAlphabet?.pronunciation }}</p>
          </div>

          <!-- Main letter -->
          <div class="mb-8">
            <div class="text-9xl font-black bg-gradient-to-br from-pink-500 via-purple-500 to-sky-500 text-transparent bg-clip-text drop-shadow-sm select-none font-fredoka">
              {{ currentAlphabet?.letter }}
            </div>
          </div>

          <!-- Example word -->
          <div class="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100">
            <p class="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Example word</p>
            <p class="text-4xl font-black text-pink-600 font-fredoka mb-4">{{ currentAlphabet?.exampleWord }}</p>
            <!-- Play example word sound button -->
            <button
              (click)="speakWord(currentAlphabet?.exampleWord)"
              class="btn-secondary px-6 py-2.5 text-xs rounded-full font-black uppercase tracking-wider"
            >
              🔊 Hear "{{ currentAlphabet?.exampleWord }}"
            </button>
          </div>

          <!-- Voice button -->
          <button
            (click)="playSound()"
            class="w-full sm:w-auto rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-10 py-5 text-xl font-black text-white shadow-neon hover:scale-105 active:scale-95 transition-all duration-300 animate-bounce-slow"
          >
            🔊 Hear the Sound
          </button>
        </div>

        <!-- Learning tips -->
        <div class="card-floating p-6 mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-4 border-emerald-300">
          <h3 class="text-lg font-black text-emerald-600 mb-2">💡 Learning Tip</h3>
          <p class="text-teal-700 font-bold text-sm">
            Try to pronounce the letter and the example word together: "{{ currentAlphabet?.pronunciation }} for {{ currentAlphabet?.exampleWord }}"
          </p>
        </div>

        <!-- Navigation buttons -->
        <div class="grid grid-cols-3 gap-3">
          <button
            (click)="previousAlphabet()"
            [disabled]="currentIndex === 0"
            class="btn-secondary py-4 rounded-full font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <button
            (click)="skipAlphabet()"
            class="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-soft"
          >
            ⭐
          </button>

          <button
            (click)="nextAlphabet()"
            [disabled]="currentIndex === alphabets.length - 1"
            class="rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-300 shadow-soft"
          >
            Next →
          </button>
        </div>

        <!-- Done learning -->
        <div *ngIf="currentIndex === alphabets.length - 1" class="mt-12 text-center animate-scale-up">
          <p class="text-2xl font-black text-pink-600 mb-6">Great job! You've learned all alphabets! 🎉</p>
          <button
            (click)="completeLearning()"
            class="rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-10 py-5 text-lg font-black text-white shadow-neon hover:scale-105 active:scale-95 transition-all duration-300"
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
        <div class="text-6xl animate-bounce-slow">🎉</div>
        <div class="text-6xl animate-bounce-slow" style="animation-delay: 0.2s">⭐</div>
        <div class="text-6xl animate-bounce-slow" style="animation-delay: 0.4s">🎊</div>
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
