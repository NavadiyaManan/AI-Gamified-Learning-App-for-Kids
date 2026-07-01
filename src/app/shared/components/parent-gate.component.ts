import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '@core/services/audio.service';

@Component({
  selector: 'app-parent-gate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="close()">
      <div class="modal-content bg-gradient-to-br from-pastel-purple to-purple-50 text-center max-w-sm p-8" (click)="$event.stopPropagation()">
        <!-- Mascot-like header inside modal -->
        <div class="text-6xl mb-4 animate-bounce-slow">🔒</div>
        <h2 class="text-2xl font-black text-primary mb-2">Parents Only!</h2>
        <p class="text-sm font-bold text-slate-500 mb-6">
          To visit this screen, please ask a parent to solve this question:
        </p>

        <!-- Question display -->
        <div class="bg-white rounded-3xl p-6 mb-6 border-4 border-primary">
          <p class="text-3xl font-black text-primary font-fredoka">
            {{ num1 }} + {{ num2 }} = ?
          </p>
        </div>

        <!-- Answer input -->
        <div class="mb-6">
          <input
            [(ngModel)]="userAnswer"
            type="number"
            class="w-full px-6 py-4 rounded-2xl border-2 border-primary text-center text-3xl font-black focus:outline-none focus:ring-4 focus:ring-secondary"
            placeholder="Answer"
            (keyup.enter)="checkAnswer()"
            autofocus
            aria-label="Parent verification answer"
          />
        </div>

        <!-- Buttons -->
        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            (click)="close()"
            class="btn-secondary py-3.5 rounded-full font-black text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            (click)="checkAnswer()"
            class="btn-primary py-3.5 rounded-full font-black text-sm"
          >
            Enter ✓
          </button>
        </div>

        <!-- Hint or feedback -->
        <p *ngIf="feedbackMessage" class="mt-4 text-xs font-black text-danger">
          {{ feedbackMessage }}
        </p>
      </div>
    </div>
  `,
})
export class ParentGateComponent {
  @Output() verified = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isOpen = false;
  num1 = 0;
  num2 = 0;
  userAnswer: number | null = null;
  feedbackMessage = '';

  constructor(private audio: AudioService) {}

  open(): void {
    this.generateQuestion();
    this.userAnswer = null;
    this.feedbackMessage = '';
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  generateQuestion(): void {
    // Generate simple additions that pre-readers/children aged 2-5 are unlikely to solve instantly, but parents can in 1s.
    this.num1 = Math.floor(Math.random() * 8) + 8; // 8-15
    this.num2 = Math.floor(Math.random() * 8) + 5; // 5-12
  }

  checkAnswer(): void {
    if (this.userAnswer === null) {
      this.feedbackMessage = 'Please enter the answer.';
      return;
    }

    const correctAnswer = this.num1 + this.num2;
    if (Number(this.userAnswer) === correctAnswer) {
      this.audio.play('success');
      this.isOpen = false;
      this.verified.emit();
    } else {
      this.audio.play('fail');
      this.feedbackMessage = 'Oops, that is not correct! Try another one.';
      this.generateQuestion();
      this.userAnswer = null;
    }
  }
}
