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
    <div class="min-h-screen bg-gradient-to-br from-pastel-yellow via-pastel-orange to-pastel-pink pb-24 md:pb-12">
      <!-- Header with timer -->
      <div class="bg-gradient-to-r from-warning to-primary p-6 md:p-8 shadow-soft-lg">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-white">Puzzle Game! 🧩</h1>
            <p class="text-white opacity-90 font-semibold">{{ currentPuzzle?.title }}</p>
          </div>
          <div class="text-center bg-white bg-opacity-20 backdrop-blur rounded-2xl px-6 py-3">
            <p class="text-white text-sm opacity-90">Time Left</p>
            <p class="text-4xl font-bold text-white">{{ timeLeft }}s</p>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-4xl mx-auto px-6 md:px-8 py-8">
        <!-- Puzzle area -->
        <div class="card-floating p-12 mb-8 text-center shadow-soft-lg">
          <!-- Puzzle image/emoji -->
          <div class="text-9xl mb-8 animate-float drop-shadow-lg">
            {{ currentPuzzle?.image }}
          </div>

          <!-- Puzzle grid -->
          <div class="grid grid-cols-3 gap-4 bg-gradient-to-br from-pastel-blue to-pastel-purple rounded-3xl p-8 mb-8 shadow-soft">
            <div
              *ngFor="let piece of puzzlePieces"
              (click)="selectPiece(piece)"
              [class.opacity-50]="piece.placed"
              [class.cursor-not-allowed]="piece.placed"
              class="card-floating p-4 text-center cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
              [class.border-4]="selectedPiece?.id === piece.id"
              [class.border-accent-green]="selectedPiece?.id === piece.id"
            >
              <div class="text-5xl">{{ piece.emoji }}</div>
              <p class="text-xs font-bold text-primary mt-2">Piece {{ piece.position + 1 }}</p>
            </div>
          </div>

          <!-- Instructions -->
          <div class="bg-gradient-to-r from-pastel-green to-green-50 rounded-2xl p-6">
            <p class="text-lg font-bold text-primary">
              <span *ngIf="!puzzleComplete">✨ Click on puzzle pieces to place them! ({{ placedCount }}/{{ currentPuzzle?.pieces }})</span>
              <span *ngIf="puzzleComplete">🎉 Puzzle Complete!</span>
            </p>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="card-floating p-4 text-center">
            <p class="text-sm text-gray-600 font-semibold">Pieces Placed</p>
            <p class="text-4xl font-bold text-primary">{{ placedCount }}/{{ currentPuzzle?.pieces }}</p>
          </div>
          <div class="card-floating p-4 text-center">
            <p class="text-sm text-gray-600 font-semibold">Progress</p>
            <p class="text-4xl font-bold text-secondary">{{ ((placedCount / (currentPuzzle?.pieces || 1)) * 100).toFixed(0) }}%</p>
          </div>
          <div class="card-floating p-4 text-center">
            <p class="text-sm text-gray-600 font-semibold">Difficulty</p>
            <p class="text-2xl font-bold text-warning">{{ currentPuzzle?.difficulty | titlecase }}</p>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="card-floating p-6 mb-8">
          <div class="bg-gray-300 rounded-full h-6 overflow-hidden shadow-soft">
            <div
              class="bg-gradient-to-r from-warning via-primary to-secondary h-full animate-pulse-glow transition-all duration-300"
              [style.width.%]="((placedCount / (currentPuzzle?.pieces || 1)) * 100)"
            ></div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-4 justify-center mb-8">
          <button
            (click)="reset()"
            class="btn-secondary px-6 py-3 transform hover:scale-110 active:scale-95"
          >
            ↻ Reset
          </button>
          <button
            (click)="goBack()"
            class="btn-secondary px-6 py-3 transform hover:scale-110 active:scale-95"
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
            <h2 class="text-3xl font-bold text-primary mb-3">Amazing!</h2>
            <p class="text-lg text-secondary font-semibold mb-6">
              You completed the puzzle in {{ getCompletionTime() }} seconds!
            </p>

            <!-- Stars earned -->
            <div class="flex justify-center gap-2 mb-6">
              <div class="text-5xl animate-float">⭐</div>
              <div class="text-5xl animate-float" style="animation-delay: 0.2s">⭐</div>
              <div class="text-5xl animate-float" style="animation-delay: 0.4s">⭐</div>
            </div>

            <p class="text-2xl font-bold text-accent-green mb-6">+300 XP!</p>

            <button
              (click)="closePuzzle()"
              class="btn-primary w-full"
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
