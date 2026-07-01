import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '@core/services/data.service';
import { AudioService } from '@core/services/audio.service';
import { MascotService } from '@core/services/mascot.service';
import { SettingsService } from '@core/services/settings.service';

interface NumberCard {
    number: number;
    word: string;
    pronunciation: string;
}

@Component({
    selector: 'app-numbers',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-pastel-green via-pastel-blue to-pastel-cyan pb-32">
      <!-- Floating Header Card -->
      <header class="px-5 pt-8 md:px-10">
        <div class="mx-auto max-w-6xl">
          <div class="card-floating p-6 md:p-8 flex flex-col gap-4 relative">
            <button (click)="goBack()" 
              class="absolute right-6 top-6 btn-icon bg-slate-100 text-primary hover:bg-slate-200 w-10 h-10 flex items-center justify-center rounded-full text-base font-black">
              ✕
            </button>
            <div>
              <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">MATH QUEST</p>
              <h1 class="text-3xl md:text-4xl font-black text-pink-500">Learn Numbers! 🔢</h1>
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
      <div class="max-w-6xl mx-auto px-5 py-8 md:px-10">
        <!-- Progress indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs uppercase tracking-widest font-black text-pink-500">Progress: {{ completedCount }}/{{ numbers.length }}</p>
            <p class="text-sm font-black text-cyan-500">{{ ((completedCount / numbers.length) * 100).toFixed(0) }}%</p>
          </div>
          <div class="bg-slate-100 rounded-full h-5 overflow-hidden border-2 border-white shadow-inner relative">
            <div
              class="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 animated-xp transition-all duration-500"
              [style.width.%]="((completedCount / numbers.length) * 100)"
            ></div>
          </div>
        </div>

        <!-- Numbers Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          <div 
            *ngFor="let card of numbers; let i = index"
            (click)="selectNumber(card, i)"
            class="cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div class="card-floating p-8 text-center shadow-soft-lg hover:shadow-neon border-4 border-primary hover:border-secondary flex flex-col justify-between items-center min-h-[260px]">
              <!-- Number emoji -->
              <div class="text-5xl mb-2 animate-float select-none">
                {{ getNumberEmoji(card.number) }}
              </div>

              <!-- Large number -->
              <div class="text-6xl font-black bg-gradient-to-br from-secondary to-primary text-transparent bg-clip-text mb-2 font-fredoka select-none">
                {{ card.number }}
              </div>

              <!-- Number word -->
              <div class="bg-slate-50 rounded-2xl p-2 mb-4 w-full border border-slate-100">
                <p class="text-lg font-black text-primary font-fredoka">{{ card.word }}</p>
              </div>

              <!-- Voice button -->
              <button
                (click)="speakNumber(card); $event.stopPropagation()"
                class="btn-secondary w-full py-2 text-xs uppercase tracking-wider"
              >
                🔊 Hear
              </button>

              <!-- Completed badge -->
              <div *ngIf="isCompleted(i)" class="mt-3 px-3 py-1 bg-gradient-to-r from-accent-green to-green-400 text-white rounded-full text-xs font-black uppercase tracking-wider">
                ✓ Done
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-4 justify-center flex-wrap">
          <button
            (click)="goBack()"
            class="btn-secondary px-8 py-3.5 rounded-full font-black text-sm"
          >
            ← Back
          </button>
          <button
            *ngIf="completedCount === numbers.length"
            (click)="completeLearning()"
            class="btn-primary px-8 py-3.5 text-sm font-black"
          >
            ✨ Earn Reward!
          </button>
        </div>
      </div>

      <!-- Puzzle Modal -->
      <div *ngIf="showPuzzle" class="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-[2.5rem] p-8 max-w-md w-full card-floating" [class.shake]="isShaking">
          <div class="text-center mb-6">
            <p class="text-xs uppercase tracking-widest font-black text-secondary mb-2">Number Challenge</p>
            <div class="text-7xl mb-4 animate-float select-none">{{ selectedNumberCard?.number }}</div>
            <h3 class="text-3xl font-black text-primary mb-2 font-fredoka">{{ selectedNumberCard?.word }}</h3>
            <p class="text-lg font-bold text-gray-600 mb-6">Count {{ selectedNumberCard?.number }} items!</p>
          </div>

          <!-- Interactive counting challenge -->
          <div class="bg-gradient-to-br from-pastel-blue to-cyan-50 rounded-[2rem] p-6 mb-6">
            <div class="grid grid-cols-4 gap-3 justify-items-center">
              <div
                *ngFor="let item of getCountingItems()"
                class="text-4xl cursor-pointer transition-all transform hover:scale-125 hover:rotate-12 animate-bounce-slow select-none"
                [style.animation-delay]="(item * 0.1) + 's'"
              >
                {{ getNumberEmoji(selectedNumberCard?.number || 0) }}
              </div>
            </div>
          </div>

          <!-- Challenge input -->
          <div class="mb-6">
            <label class="block text-sm font-bold text-primary mb-2">How many did you count?</label>
            <input
              [(ngModel)]="userAnswer"
              type="number"
              [min]="0"
              [max]="10"
              class="w-full px-6 py-4 rounded-2xl border-2 border-primary text-center text-3xl font-black focus:outline-none focus:ring-4 focus:ring-secondary"
              placeholder="?"
              (keyup.enter)="checkAnswer()"
              autofocus
            />
          </div>

          <!-- Buttons -->
          <div class="grid grid-cols-2 gap-4">
            <button
              (click)="closePuzzle()"
              class="btn-secondary"
            >
              Skip
            </button>
            <button
              (click)="checkAnswer()"
              class="btn-primary"
            >
              Check ✓
            </button>
          </div>

          <!-- Feedback -->
          <div *ngIf="showFeedback" class="mt-4 p-4 rounded-3xl text-center font-black text-base" [ngClass]="isCorrect ? 'bg-success text-white' : 'bg-amber-100 text-warning border-2 border-warning'">
            {{ isCorrect ? '🎉 Correct! Great job!' : '🌟 That was close! Let\'s count again!' }}
          </div>
        </div>
      </div>

      <!-- Celebration popup -->
      <div
        *ngIf="showCelebration"
        class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div class="text-7xl animate-bounce-slow">🎉</div>
        <div class="text-7xl animate-bounce-slow" style="animation-delay: 0.1s">⭐</div>
        <div class="text-7xl animate-bounce-slow" style="animation-delay: 0.2s">🎈</div>
        <div class="text-7xl animate-bounce-slow" style="animation-delay: 0.3s">🎊</div>
        <div class="text-7xl animate-bounce-slow" style="animation-delay: 0.4s">✨</div>
      </div>
    </div>
  `,
    styles: []
})
export class NumbersComponent implements OnInit {
    numbers: NumberCard[] = [
        { number: 0, word: 'Zero', pronunciation: 'zero' },
        { number: 1, word: 'One', pronunciation: 'one' },
        { number: 2, word: 'Two', pronunciation: 'two' },
        { number: 3, word: 'Three', pronunciation: 'three' },
        { number: 4, word: 'Four', pronunciation: 'four' },
        { number: 5, word: 'Five', pronunciation: 'five' },
        { number: 6, word: 'Six', pronunciation: 'six' },
        { number: 7, word: 'Seven', pronunciation: 'seven' },
        { number: 8, word: 'Eight', pronunciation: 'eight' },
        { number: 9, word: 'Nine', pronunciation: 'nine' },
    ];

    completedNumbers: Set<number> = new Set();
    showPuzzle: boolean = false;
    selectedNumberCard: NumberCard | null = null;
    selectedNumberIndex: number = -1;
    userAnswer: number | null = null;
    showFeedback: boolean = false;
    isCorrect: boolean = false;
    isShaking: boolean = false;
    showCelebration: boolean = false;
    completedCount: number = 0;

    numberEmojis = ['🍩', '🎈', '🍭', '🐢', '🦖', '🍎', '🚗', '🦁', '🌟', '🧁'];

    // Voice selection properties
    availableVoices: SpeechSynthesisVoice[] = [];
    selectedVoiceIndex: number = 0;

    constructor(
        private dataService: DataService,
        private router: Router,
        private audio: AudioService,
        private mascot: MascotService,
        public settingsService: SettingsService
    ) { }

    ngOnInit(): void {
        this.loadAvailableVoices();

        // Narrate instructions on load
        setTimeout(() => {
            if (this.settingsService.narrationEnabledValue) {
                this.speak("Let's learn numbers! Tap on any number to solve a fun counting puzzle.");
            }
        }, 800);
    }

    loadAvailableVoices(): void {
        const voices = window.speechSynthesis.getVoices();
        this.availableVoices = voices.filter(voice => voice.lang.startsWith('en'));
        if (this.availableVoices.length === 0) {
            this.availableVoices = voices;
        }
        // Load voice index from global settings
        this.selectedVoiceIndex = this.settingsService.selectedVoiceIndexValue;
        if (this.selectedVoiceIndex >= this.availableVoices.length) {
            this.selectedVoiceIndex = 0;
        }
    }

    getVoiceName(voice: SpeechSynthesisVoice): string {
        return `${voice.name}${voice.default ? ' (Default)' : ''}`;
    }

    onVoiceChanged(): void {
        this.settingsService.setSelectedVoiceIndex(Number(this.selectedVoiceIndex));
    }

    playVoiceDemo(): void {
        this.speak('Number learning is fun!');
    }

    selectNumber(card: NumberCard, index: number): void {
        this.selectedNumberCard = card;
        this.selectedNumberIndex = index;
        this.showPuzzle = true;
        this.userAnswer = null;
        this.showFeedback = false;
        this.isCorrect = false;
        this.isShaking = false;

        // Auto announce challenge
        setTimeout(() => {
            if (this.settingsService.narrationEnabledValue && card) {
                this.speak(`Count how many ${card.number === 1 ? 'item' : 'items'} you see. How many is ${card.word}?`);
            }
        }, 300);
    }

    closePuzzle(): void {
        this.showPuzzle = false;
        this.selectedNumberCard = null;
        this.selectedNumberIndex = -1;
    }

    checkAnswer(): void {
        if (this.userAnswer === null) {
            return;
        }

        this.isCorrect = this.userAnswer === this.selectedNumberCard?.number;
        this.showFeedback = true;

        if (this.isCorrect) {
            this.completedNumbers.add(this.selectedNumberIndex);
            this.completedCount = this.completedNumbers.size;
            const child = this.dataService.getCurrentChild();
            if (child) {
                this.dataService.updateChildProgress(child.id, 'numbers', 20);
            }
            this.showCelebration = true;
            this.audio.play('success');
            this.mascot.celebrate(`Correct! That is number ${this.selectedNumberCard?.word}!`);

            setTimeout(() => {
                this.showCelebration = false;
                this.closePuzzle();
            }, 1800);
        } else {
            this.audio.play('fail');
            this.isShaking = true;
            
            // Encouraging retry message
            const encouragement = `That was close! Count them one more time. You can do it!`;
            this.mascot.retry(encouragement);

            setTimeout(() => {
                this.isShaking = false;
            }, 500);
        }
    }

    getCountingItems(): number[] {
        return Array(this.selectedNumberCard?.number || 0).fill(0).map((_, i) => i);
    }

    getNumberEmoji(num: number): string {
        return this.numberEmojis[num] || '⭐';
    }

    isCompleted(index: number): boolean {
        return this.completedNumbers.has(index);
    }

    speakNumber(card: NumberCard): void {
        this.speak(card.pronunciation);
    }

    speak(text: string): void {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.35;
        utterance.volume = 1;

        const voiceIdx = this.settingsService.selectedVoiceIndexValue;
        if (this.availableVoices.length > 0 && voiceIdx < this.availableVoices.length) {
            utterance.voice = this.availableVoices[voiceIdx];
        }

        window.speechSynthesis.speak(utterance);
    }

    completeLearning(): void {
        this.showCelebration = true;
        this.audio.play('levelUp');
        this.mascot.celebrate('All numbers complete! Brilliant work!');
        setTimeout(() => {
            window.speechSynthesis.cancel();
            this.router.navigate(['/dashboard']);
        }, 2000);
    }

    goBack(): void {
        window.speechSynthesis.cancel();
        this.router.navigate(['/dashboard']);
    }
}
