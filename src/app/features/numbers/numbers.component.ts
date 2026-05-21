import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '@core/services/data.service';
import { AudioService } from '@core/services/audio.service';
import { MascotService } from '@core/services/mascot.service';

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
    <div class="min-h-screen bg-gradient-to-br from-pastel-green via-pastel-blue to-pastel-cyan pb-24 md:pb-12">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary to-secondary p-6 md:p-8 shadow-soft-lg">
        <div class="max-w-6xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl md:text-4xl font-bold text-white">Learn Numbers! 🔢</h1>
            <button (click)="goBack()" class="btn-icon bg-white text-primary hover:bg-gray-100">
              ✕
            </button>
          </div>
          <!-- Voice Selector -->
          <div class="flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur rounded-xl p-4">
            <label class="text-white font-bold text-sm md:text-base">🔊 Choose Voice:</label>
            <select
              [(ngModel)]="selectedVoiceIndex"
              (change)="onVoiceChanged()"
              class="px-4 py-2 rounded-lg border-2 border-white bg-white text-primary font-bold cursor-pointer focus:outline-none"
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
      <div class="max-w-6xl mx-auto px-6 md:px-8 py-8">
        <!-- Progress indicator -->
        <div class="mb-12">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-bold text-primary">Progress: {{ completedCount }}/{{ numbers.length }}</p>
            <p class="text-sm font-bold text-secondary">{{ ((completedCount / numbers.length) * 100).toFixed(0) }}%</p>
          </div>
          <div class="bg-white rounded-full h-4 overflow-hidden shadow-soft">
            <div
              class="bg-gradient-to-r from-primary to-secondary h-full animate-pulse-glow transition-all duration-500"
              [style.width.%]="((completedCount / numbers.length) * 100)"
            ></div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="card-floating p-6 mb-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-3 border-accent-yellow">
          <h2 class="text-xl font-bold text-primary mb-2">👆 Click on any number to solve a puzzle!</h2>
          <p class="text-secondary font-semibold">Each number has a fun challenge. Can you solve them all?</p>
        </div>

        <!-- Numbers Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          <div 
            *ngFor="let card of numbers; let i = index"
            (click)="selectNumber(card, i)"
            class="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
          >
            <div class="card-floating p-8 text-center shadow-soft-lg hover:shadow-neon border-4 border-primary hover:border-secondary">
              <!-- Number emoji -->
              <div class="text-5xl mb-4 animate-float">
                {{ getNumberEmoji(card.number) }}
              </div>

              <!-- Large number -->
              <div class="text-6xl font-bold bg-gradient-to-br from-secondary to-primary text-transparent bg-clip-text mb-4">
                {{ card.number }}
              </div>

              <!-- Number word -->
              <div class="bg-white rounded-xl p-3 mb-4">
                <p class="text-lg font-bold text-primary">{{ card.word }}</p>
              </div>

              <!-- Voice button -->
              <button
                (click)="speakNumber(card); $event.stopPropagation()"
                class="btn-secondary px-4 py-2 text-sm w-full"
              >
                🔊 Hear
              </button>

              <!-- Completed badge -->
              <div *ngIf="isCompleted(i)" class="mt-3 px-3 py-1 bg-gradient-to-r from-accent-green to-green-400 text-white rounded-full text-xs font-bold">
                ✓ Done
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-4 justify-center flex-wrap">
          <button
            (click)="goBack()"
            class="btn-secondary px-8 py-3"
          >
            ← Back
          </button>
          <button
            *ngIf="completedCount === numbers.length"
            (click)="completeLearning()"
            class="btn-primary px-8 py-3 text-lg"
          >
            ✨ All Done! Earn Reward
          </button>
        </div>
      </div>

      <!-- Puzzle Modal -->
      <div *ngIf="showPuzzle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-3xl p-8 max-w-md w-11/12 card-floating">
          <div class="text-center mb-6">
            <p class="text-lg font-bold text-secondary mb-2">Number Challenge</p>
            <div class="text-7xl mb-4">{{ selectedNumberCard?.number }}</div>
            <h3 class="text-3xl font-bold text-primary mb-2">{{ selectedNumberCard?.word }}</h3>
            <p class="text-lg font-bold text-gray-600 mb-6">Count {{ selectedNumberCard?.number }} items!</p>
          </div>

          <!-- Interactive counting challenge -->
          <div class="bg-gradient-to-br from-pastel-blue to-cyan-50 rounded-2xl p-6 mb-6">
            <div class="grid grid-cols-4 gap-3">
              <div
                *ngFor="let item of getCountingItems()"
                class="text-4xl cursor-pointer transition-all transform hover:scale-125 hover:rotate-12 animate-bounce-slow"
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
              class="w-full px-4 py-3 rounded-xl border-2 border-primary text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Enter answer"
            />
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              (click)="closePuzzle()"
              class="btn-secondary flex-1"
            >
              Skip
            </button>
            <button
              (click)="checkAnswer()"
              class="btn-primary flex-1"
            >
              Check ✓
            </button>
          </div>

          <!-- Feedback -->
          <div *ngIf="showFeedback" class="mt-4 p-4 rounded-xl text-center text-white font-bold text-lg" [ngClass]="isCorrect ? 'bg-green-500' : 'bg-red-500'">
            {{ isCorrect ? '🎉 Correct! Great job!' : '❌ Try again!' }}
          </div>
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
    showCelebration: boolean = false;
    completedCount: number = 0;

    numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

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
        // Load completed numbers from data service if available
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
        this.speak('Number learning is fun!');
    }

    selectNumber(card: NumberCard, index: number): void {
        this.selectedNumberCard = card;
        this.selectedNumberIndex = index;
        this.showPuzzle = true;
        this.userAnswer = null;
        this.showFeedback = false;
        this.isCorrect = false;
    }

    closePuzzle(): void {
        this.showPuzzle = false;
        this.selectedNumberCard = null;
        this.selectedNumberIndex = -1;
    }

    checkAnswer(): void {
        if (this.userAnswer === null) {
            alert('Please enter an answer!');
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
            this.audio.play('success');
            this.mascot.celebrate('Correct! You unlocked a star!');

            setTimeout(() => {
                this.closePuzzle();
            }, 1500);
        } else {
            this.audio.play('fail');
            this.mascot.retry('That was close! Count one more time.');
        }
    }

    getCountingItems(): number[] {
        return Array(this.selectedNumberCard?.number || 0).fill(0).map((_, i) => i);
    }

    getNumberEmoji(num: number): string {
        return this.numberEmojis[num] || '0️⃣';
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
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 1;

        if (this.availableVoices.length > 0 && this.selectedVoiceIndex < this.availableVoices.length) {
            utterance.voice = this.availableVoices[this.selectedVoiceIndex];
        }

        window.speechSynthesis.speak(utterance);
    }

    completeLearning(): void {
        this.showCelebration = true;
        this.audio.play('levelUp');
        this.mascot.celebrate('All numbers complete! Brilliant work!');
        setTimeout(() => {
            this.router.navigate(['/dashboard']);
        }, 2000);
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}
