import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '@core/services/data.service';
import { AudioService } from '@core/services/audio.service';
import { MascotService } from '@core/services/mascot.service';
import { Puzzle } from '@core/models';

interface PuzzlePiece {
    id: string;
    position: number;
    placed: boolean;
    emoji: string;
}

@Component({
    selector: 'app-puzzle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-pastel-yellow via-pastel-orange to-pastel-pink pb-32">
      <!-- Floating Header Card -->
      <header class="px-5 pt-8 md:px-10">
        <div class="mx-auto max-w-4xl">
          <div class="card-floating p-6 md:p-8 flex items-center justify-between relative">
            <button (click)="goBack()" 
              class="absolute right-6 top-6 btn-icon bg-slate-100 text-primary hover:bg-slate-200 w-10 h-10 flex items-center justify-center rounded-full text-base font-black">
              ✕
            </button>
            <div>
              <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">LOGIC QUEST</p>
              <h1 class="text-3xl md:text-4xl font-black text-pink-500">Puzzle Game! 🧩</h1>
              <p class="text-slate-500 font-bold text-sm mt-1">{{ currentPuzzle?.title }}</p>
            </div>
            <div class="text-center bg-pink-500 rounded-2xl px-5 py-3 text-white border-2 border-white shadow-soft">
              <p class="text-[10px] font-black uppercase tracking-wider opacity-90">Time Left</p>
              <p class="text-3xl font-black font-fredoka mt-0.5">{{ timeLeft }}s</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <div class="max-w-4xl mx-auto px-5 py-8 md:px-10">
        <!-- Puzzle area -->
        <div class="card-floating p-8 md:p-12 mb-8 text-center shadow-soft-lg">
          <!-- Puzzle image/emoji -->
          <div class="text-8xl mb-8 animate-float drop-shadow-lg select-none">
            {{ currentPuzzle?.image }}
          </div>

          <!-- Puzzle grid -->
          <div class="grid grid-cols-3 gap-4 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-3xl p-6 md:p-8 mb-8 shadow-soft">
            <div
              *ngFor="let piece of puzzlePieces"
              (click)="selectPiece(piece)"
              [class.opacity-50]="piece.placed"
              [class.cursor-not-allowed]="piece.placed"
              class="card-floating p-4 text-center cursor-pointer transform hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center min-h-[110px]"
              [class.border-4]="selectedPiece?.id === piece.id"
              [class.border-accent-green]="selectedPiece?.id === piece.id"
            >
              <div class="text-5xl select-none">{{ piece.emoji }}</div>
              <p class="text-xs font-black text-pink-500 mt-2">Piece {{ piece.position + 1 }}</p>
            </div>
          </div>

          <!-- Instructions -->
          <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[2rem] p-5 border-4 border-emerald-300">
            <p class="text-lg font-black text-emerald-600">
              <span *ngIf="!puzzleComplete">✨ Click on puzzle pieces to place them! ({{ placedCount }}/{{ currentPuzzle?.pieces }})</span>
              <span *ngIf="puzzleComplete">🎉 Puzzle Complete!</span>
            </p>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="card-floating p-4 text-center flex flex-col justify-center items-center">
            <p class="text-xs font-black uppercase text-slate-500 tracking-wider">Pieces Placed</p>
            <p class="text-3xl font-black text-pink-500 font-fredoka mt-1">{{ placedCount }}/{{ currentPuzzle?.pieces }}</p>
          </div>
          <div class="card-floating p-4 text-center flex flex-col justify-center items-center">
            <p class="text-xs font-black uppercase text-slate-500 tracking-wider">Progress</p>
            <p class="text-3xl font-black text-cyan-500 font-fredoka mt-1">{{ ((placedCount / (currentPuzzle?.pieces || 1)) * 100).toFixed(0) }}%</p>
          </div>
          <div class="card-floating p-4 text-center flex flex-col justify-center items-center">
            <p class="text-xs font-black uppercase text-slate-500 tracking-wider">Difficulty</p>
            <p class="text-2xl font-black text-amber-500 font-fredoka mt-1">{{ currentPuzzle?.difficulty | titlecase }}</p>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="card-floating p-6 mb-8">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs uppercase tracking-widest font-black text-pink-500">Pieces Placed: {{ placedCount }}/{{ currentPuzzle?.pieces }}</p>
            <p class="text-sm font-black text-cyan-500">{{ ((placedCount / (currentPuzzle?.pieces || 1)) * 100).toFixed(0) }}%</p>
          </div>
          <div class="bg-slate-100 rounded-full h-5 overflow-hidden border-2 border-white shadow-inner relative">
            <div
              class="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 animated-xp transition-all duration-300"
              [style.width.%]="((placedCount / (currentPuzzle?.pieces || 1)) * 100)"
            ></div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-4 justify-center mb-8">
          <button
            (click)="reset()"
            class="btn-secondary px-8 py-3.5 rounded-full font-black text-sm"
          >
            ↻ Reset
          </button>
          <button
            (click)="goBack()"
            class="btn-secondary px-8 py-3.5 rounded-full font-black text-sm"
          >
            ← Back
          </button>
        </div>

        <!-- Success popup -->
        <div
          *ngIf="puzzleComplete"
          class="modal-overlay animate-scale-up"
          (click)="closePuzzle()"
        >
          <div class="modal-content bg-gradient-to-br from-pastel-yellow to-yellow-50 text-center max-w-sm" (click)="$event.stopPropagation()">
            <div class="text-8xl mb-4 animate-bounce-slow">🎉</div>
            <h2 class="text-3xl font-black text-primary mb-3">Amazing!</h2>
            <p class="text-lg text-secondary font-semibold mb-6">
              You completed the puzzle in {{ getCompletionTime() }} seconds!
            </p>

            <!-- Stars earned -->
            <div class="flex justify-center gap-2 mb-6">
              <div class="text-5xl animate-float">⭐</div>
              <div class="text-5xl animate-float" style="animation-delay: 0.2s">⭐</div>
              <div class="text-5xl animate-float" style="animation-delay: 0.4s">⭐</div>
            </div>

            <p class="text-2xl font-black text-accent-green mb-6">+300 XP!</p>

            <button
              (click)="closePuzzle()"
              class="btn-primary w-full py-4 rounded-full font-black text-base"
            >
              Continue 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class PuzzleComponent implements OnInit {
    currentPuzzle: Puzzle | null = null;
    puzzles: Puzzle[] = [];
    puzzlePieces: PuzzlePiece[] = [];
    selectedPiece: PuzzlePiece | null = null;
    placedCount: number = 0;
    puzzleComplete: boolean = false;
    timeLeft: number = 0;
    timerId: any;

    constructor(
        private dataService: DataService,
        private router: Router,
        private audio: AudioService,
        private mascot: MascotService
    ) { }

    ngOnInit(): void {
        this.puzzles = this.dataService.getPuzzles();
        this.selectRandomPuzzle();
    }

    selectRandomPuzzle(): void {
        const randomIndex = Math.floor(Math.random() * this.puzzles.length);
        this.currentPuzzle = this.puzzles[randomIndex];
        this.initializePuzzle();
    }

    initializePuzzle(): void {
        if (!this.currentPuzzle) return;

        this.puzzlePieces = Array.from({ length: this.currentPuzzle.pieces }, (_, i) => ({
            id: `piece-${i}`,
            position: i,
            placed: false,
            emoji: this.getRandomEmoji(i),
        }));

        this.placedCount = 0;
        this.puzzleComplete = false;
        this.selectedPiece = null;
        this.timeLeft = this.currentPuzzle.timeLimit;

        clearInterval(this.timerId);
        this.startTimer();
    }

    selectPiece(piece: PuzzlePiece): void {
        if (!piece.placed) {
            piece.placed = true;
            this.placedCount++;
            this.selectedPiece = piece;

            // Celebrate each placed piece
            if (this.placedCount < (this.currentPuzzle?.pieces || 0)) {
                this.audio.play('tap');
                this.mascot.encourage('Nice move!');
                setTimeout(() => {
                    this.selectedPiece = null;
                }, 600);
            } else {
                this.completePuzzle();
            }
        }
    }

    completePuzzle(): void {
        this.puzzleComplete = true;
        clearInterval(this.timerId);
        const child = this.dataService.getCurrentChild();
        if (child) {
            this.dataService.updateChildProgress(child.id, 'puzzles', 50);
        }
        this.audio.play('levelUp');
        this.mascot.celebrate('Puzzle complete! You earned a big star!');
    }

    closePuzzle(): void {
        this.router.navigate(['/rewards']);
    }

    reset(): void {
        this.initializePuzzle();
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }

    private startTimer(): void {
        this.timerId = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                clearInterval(this.timerId);
                this.audio.play('fail');
                this.mascot.retry('Time is up, but you can try again softer and slower.');
                alert('Time is up! Try again.');
                this.reset();
            }
        }, 1000);
    }

    private getRandomEmoji(index: number): string {
        const emojis = ['🌟', '🎈', '🎀', '🎁', '🎂', '🍰', '🌈', '🦋', '🌸', '🌺', '🌻', '🌷'];
        return emojis[index % emojis.length];
    }

    getCompletionTime(): number {
        return (this.currentPuzzle?.timeLimit || 0) - this.timeLeft;
    }
}
