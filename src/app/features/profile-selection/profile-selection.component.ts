import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '@core/services/data.service';
import { Child } from '@core/models';
import { AddChildModalComponent } from '@shared/components/add-child-modal.component';
import { ParentGateComponent } from '@shared/components/parent-gate.component';
import { SettingsService } from '@core/services/settings.service';
import { MascotService } from '@core/services/mascot.service';

@Component({
    selector: 'app-profile-selection',
    standalone: true,
    imports: [CommonModule, AddChildModalComponent, ParentGateComponent],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple p-6 md:p-12">
      <!-- Header -->
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-black mb-4">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Select a Child
            </span>
          </h1>
          <p class="text-xl text-primary font-black">Who's ready to learn today?</p>
        </div>

        <!-- Profile cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div *ngFor="let child of children" (click)="selectChild(child)" class="cursor-pointer transform transition-all duration-300 hover:scale-105">
            <div class="card-floating p-8 text-center hover:shadow-soft-lg hover:shadow-neon">
              <!-- Avatar -->
              <div class="mb-4 relative">
                <div class="text-8xl mx-auto mb-2 animate-float select-none">{{ child.avatar }}</div>
                <div class="w-32 h-32 mx-auto bg-gradient-to-br from-pastel-pink to-pastel-purple rounded-full opacity-10 absolute top-8 left-1/2 transform -translate-x-1/2"></div>
              </div>

              <!-- Child info -->
              <h3 class="text-2xl font-black text-primary mb-2">{{ child.name }}</h3>
              <p class="text-lg text-secondary font-bold mb-4">Age {{ child.age }}</p>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div class="bg-gradient-to-br from-pastel-yellow to-yellow-50 rounded-2xl p-3 border border-yellow-100">
                  <p class="text-xs text-gray-600 mb-1 font-bold">Level</p>
                  <p class="text-2xl font-black text-warning font-fredoka">{{ child.level }}</p>
                </div>
                <div class="bg-gradient-to-br from-pastel-green to-green-50 rounded-2xl p-3 border border-green-100">
                  <p class="text-xs text-gray-600 mb-1 font-bold">XP</p>
                  <p class="text-2xl font-black text-success font-fredoka">{{ child.totalXP }}</p>
                </div>
                <div class="bg-gradient-to-br from-pastel-orange to-orange-50 rounded-2xl p-3 border border-orange-100">
                  <p class="text-xs text-gray-600 mb-1 font-bold">Streak</p>
                  <p class="text-2xl font-black text-warning font-fredoka">🔥{{ child.streak }}</p>
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
              <div class="text-7xl mb-4 animate-bounce-slow select-none">➕</div>
              <h3 class="text-2xl font-black text-primary mb-2">Add Child</h3>
              <p class="text-secondary font-bold">Create new profile</p>
              <button class="btn-secondary w-full mt-6">
                <span class="mr-2">✨</span>
                New Child
              </button>
            </div>
          </div>
        </div>

        <!-- Parent button -->
        <div class="text-center">
          <p class="text-primary font-black mb-4">Are you a parent?</p>
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

    <!-- Parent Gate Modal -->
    <app-parent-gate
      #parentGate
      (verified)="onParentGateVerified()"
    ></app-parent-gate>
  `,
    styles: []
})
export class ProfileSelectionComponent implements OnInit {
    @ViewChild('addChildModal') addChildModal!: AddChildModalComponent;
    @ViewChild('parentGate') parentGate!: ParentGateComponent;
    children: Child[] = [];

    constructor(
        private dataService: DataService,
        private router: Router,
        private settingsService: SettingsService,
        private mascot: MascotService
    ) { }

    ngOnInit(): void {
        this.dataService.children$.subscribe(children => {
            this.children = children;
        });

        // TTS Speech instruction for children
        setTimeout(() => {
            if (this.settingsService.narrationEnabledValue) {
                this.speak("Who is ready to learn today? Tap on your name, or tap add child to create a new profile.");
            }
        }, 800);
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
        this.mascot.celebrate(`${newChild.name} has been added!`);
        if (this.settingsService.narrationEnabledValue) {
            this.speak(`${newChild.name} has been added! Select their name to start learning.`);
        }
    }

    onModalClosed(): void {
        // Modal closed - no action needed
    }

    goToParentDashboard(): void {
        this.parentGate.open();
    }

    onParentGateVerified(): void {
        this.router.navigate(['/parent-dashboard']);
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
