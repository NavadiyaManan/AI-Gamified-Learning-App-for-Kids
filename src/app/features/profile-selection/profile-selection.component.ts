import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '@core/services/data.service';
import { Child } from '@core/models';
import { AddChildModalComponent } from '@shared/components/add-child-modal.component';

@Component({
    selector: 'app-profile-selection',
    standalone: true,
    imports: [CommonModule, AddChildModalComponent],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple p-6 md:p-12">
      <!-- Header -->
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Select a Child
            </span>
          </h1>
          <p class="text-xl text-primary font-semibold">Who's ready to learn today?</p>
        </div>

        <!-- Profile cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div *ngFor="let child of children" (click)="selectChild(child)" class="cursor-pointer transform transition-all duration-300 hover:scale-105">
            <div class="card-floating p-8 text-center hover:shadow-soft-lg hover:shadow-neon">
              <!-- Avatar -->
              <div class="mb-4">
                <div class="text-8xl mx-auto mb-2 animate-float">{{ child.avatar }}</div>
                <div class="w-32 h-32 mx-auto bg-gradient-to-br from-pastel-pink to-pastel-purple rounded-full opacity-10 absolute top-8 left-1/2 transform -translate-x-1/2"></div>
              </div>

              <!-- Child info -->
              <h3 class="text-2xl font-bold text-primary mb-2">{{ child.name }}</h3>
              <p class="text-lg text-secondary font-semibold mb-4">Age {{ child.age }}</p>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div class="bg-gradient-to-br from-pastel-yellow to-yellow-50 rounded-2xl p-3">
                  <p class="text-xs text-gray-600 mb-1">Level</p>
                  <p class="text-2xl font-bold text-warning">{{ child.level }}</p>
                </div>
                <div class="bg-gradient-to-br from-pastel-green to-green-50 rounded-2xl p-3">
                  <p class="text-xs text-gray-600 mb-1">XP</p>
                  <p class="text-2xl font-bold text-success">{{ child.totalXP }}</p>
                </div>
                <div class="bg-gradient-to-br from-pastel-orange to-orange-50 rounded-2xl p-3">
                  <p class="text-xs text-gray-600 mb-1">Streak</p>
                  <p class="text-2xl font-bold text-warning">🔥{{ child.streak }}</p>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                  [style.width.%]="(child.level * 5)"
                ></div>
              </div>

              <!-- Button -->
              <button
                class="btn-primary w-full"
              >
                <span class="mr-2">👋</span>
                Enter as {{ child.name }}
              </button>
            </div>
          </div>

          <!-- Add child card -->
          <div (click)="addNewChild()" class="cursor-pointer transform transition-all duration-300 hover:scale-105">
            <div class="card-floating p-8 text-center hover:shadow-soft-lg hover:shadow-neon h-full flex flex-col items-center justify-center min-h-80">
              <div class="text-7xl mb-4 animate-bounce-slow">➕</div>
              <h3 class="text-2xl font-bold text-primary mb-2">Add Child</h3>
              <p class="text-secondary font-semibold">Create new profile</p>
              <button class="btn-secondary w-full mt-6">
                <span class="mr-2">✨</span>
                New Child
              </button>
            </div>
          </div>
        </div>

        <!-- Parent button -->
        <div class="text-center">
          <p class="text-primary font-semibold mb-4">Are you a parent?</p>
          <button
            (click)="goToParentDashboard()"
            class="btn-secondary px-8 py-3"
          >
            <span class="mr-2">👨‍👩‍👧‍👦</span>
            Parent Dashboard
          </button>
        </div>
      </div>
    </div>

    <!-- Add Child Modal -->
    <app-add-child-modal
      #addChildModal
      (childAdded)="onChildAdded($event)"
      (closed)="onModalClosed()"
    ></app-add-child-modal>
  `,
    styles: []
})
export class ProfileSelectionComponent implements OnInit {
    @ViewChild('addChildModal') addChildModal!: AddChildModalComponent;
    children: Child[] = [];

    constructor(
        private dataService: DataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.dataService.children$.subscribe(children => {
            this.children = children;
        });
    }

    selectChild(child: Child): void {
        this.dataService.setCurrentChild(child);
        this.router.navigate(['/dashboard']);
    }

    addNewChild(): void {
        this.addChildModal.open();
    }

    onChildAdded(newChild: Child): void {
        this.dataService.addChild(newChild);
        alert(`✨ ${newChild.name} has been added! Select them to start learning.`);
    }

    onModalClosed(): void {
        // Modal closed - no action needed
    }

    goToParentDashboard(): void {
        this.router.navigate(['/parent-dashboard']);
    }
}
