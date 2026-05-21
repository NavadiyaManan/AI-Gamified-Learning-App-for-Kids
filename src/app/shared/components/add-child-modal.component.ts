import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Child } from '@core/models';

@Component({
    selector: 'app-add-child-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div *ngIf="isOpen" class="modal-overlay animate-scale-up">
      <div class="modal-content bg-gradient-to-br from-pastel-blue to-blue-50 text-left" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold text-primary">Create New Child Profile 👧</h2>
          <button (click)="close()" class="btn-icon bg-gray-200 text-primary hover:bg-gray-300">
            ✕
          </button>
        </div>

        <form (ngSubmit)="submitForm()" class="space-y-6">
          <!-- Child Name -->
          <div>
            <label class="block text-lg font-bold text-primary mb-2">Child's Name</label>
            <input
              [(ngModel)]="formData.name"
              name="name"
              type="text"
              class="w-full px-6 py-3 rounded-2xl border-2 border-primary focus:outline-none focus:ring-2 focus:ring-secondary text-lg"
              placeholder="Enter child's name"
              required
            />
          </div>

          <!-- Age -->
          <div>
            <label class="block text-lg font-bold text-primary mb-2">Age</label>
            <div class="flex gap-4 items-center">
              <input
                [(ngModel)]="formData.age"
                name="age"
                type="number"
                min="2"
                max="10"
                class="w-24 px-6 py-3 rounded-2xl border-2 border-primary focus:outline-none focus:ring-2 focus:ring-secondary text-lg text-center"
                required
              />
              <span class="text-secondary font-bold text-lg">years old</span>
            </div>
          </div>

          <!-- Avatar Selection -->
          <div>
            <label class="block text-lg font-bold text-primary mb-2">Choose Avatar</label>
            <div class="grid grid-cols-6 gap-3">
              <button
                *ngFor="let avatar of avatarOptions"
                (click)="selectAvatar(avatar)"
                type="button"
                class="text-4xl p-2 rounded-2xl transition-all duration-300"
                [class.ring-4]="formData.avatar === avatar"
                [class.ring-primary]="formData.avatar === avatar"
                [class.bg-gray-100]="formData.avatar !== avatar"
                [class.bg-gradient-to-br]="formData.avatar === avatar"
                [class.from-primary]="formData.avatar === avatar"
                [class.to-secondary]="formData.avatar === avatar"
              >
                {{ avatar }}
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-6">
            <button
              type="button"
              (click)="close()"
              class="btn-secondary flex-1 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary flex-1 py-3"
            >
              Create Child Profile ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: []
})
export class AddChildModalComponent {
    @Output() childAdded = new EventEmitter<Child>();
    @Output() closed = new EventEmitter<void>();

    isOpen = false;
    avatarOptions = ['👧', '👦', '👧🏻', '👦🏻', '👧🏽', '👦🏽'];

    formData = {
        name: '',
        age: 5,
        avatar: '👧'
    };

    open(): void {
        this.isOpen = true;
        this.resetForm();
    }

    close(): void {
        this.isOpen = false;
        this.closed.emit();
    }

    selectAvatar(avatar: string): void {
        this.formData.avatar = avatar;
    }

    submitForm(): void {
        if (this.formData.name.trim() && this.formData.age >= 2 && this.formData.age <= 10) {
            const newChild: Child = {
                id: Date.now().toString(),
                name: this.formData.name,
                age: this.formData.age,
                avatar: this.formData.avatar,
                totalXP: 0,
                streak: 0,
                level: 1,
                learningProgress: {
                    alphabets: { completed: 0, total: 26 },
                    numbers: { completed: 0, total: 10 },
                    animals: { completed: 0, total: 20 },
                    puzzles: { completed: 0, total: 15 },
                    stories: { completed: 0, total: 10 },
                },
                createdDate: new Date(),
            };

            this.childAdded.emit(newChild);
            this.close();
        } else {
            alert('Please fill in all fields correctly');
        }
    }

    private resetForm(): void {
        this.formData = {
            name: '',
            age: 5,
            avatar: '👧'
        };
    }
}
