import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '@core/services/data.service';
import { AudioService } from '@core/services/audio.service';
import { MascotService } from '@core/services/mascot.service';

interface AnimalCard {
    name: string;
    emoji: string;
    sound: string;
    pronunciation: string;
    funFact: string;
}

@Component({
    selector: 'app-animals',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-pastel-yellow via-pastel-green to-pastel-blue pb-32">
      <!-- Floating Header Card -->
      <header class="px-5 pt-8 md:px-10">
        <div class="mx-auto max-w-6xl">
          <div class="card-floating p-6 md:p-8 flex flex-col gap-4 relative">
            <button (click)="goBack()" 
              class="absolute right-6 top-6 btn-icon bg-slate-100 text-primary hover:bg-slate-200 w-10 h-10 flex items-center justify-center rounded-full text-base font-black">
              ✕
            </button>
            <div>
              <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">WILDLIFE QUEST</p>
              <h1 class="text-3xl md:text-4xl font-black text-pink-500">Learn Animals! 🦁</h1>
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

      <!-- Progress Bar Section -->
      <div class="max-w-6xl mx-auto px-5 pt-8 md:px-10">
        <div class="mb-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs uppercase tracking-widest font-black text-pink-500">Progress: {{ completedCount }}/{{ animalCards.length }}</p>
            <p class="text-sm font-black text-cyan-500">{{ (completedCount / animalCards.length * 100).toFixed(0) }}%</p>
          </div>
          <div class="bg-slate-100 rounded-full h-5 overflow-hidden border-2 border-white shadow-inner relative">
            <div
              class="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 animated-xp transition-all duration-500"
              [style.width.%]="(completedCount / animalCards.length * 100)"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-6xl mx-auto px-5 py-8 md:px-10">
        <!-- Animal cards grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            *ngFor="let card of animalCards; let i = index"
            (click)="selectAnimal(card, i)"
            class="card-floating p-6 cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col justify-between items-center text-center bg-white border-4 border-slate-50 min-h-[220px]"
          >
            <!-- Animal emoji -->
            <div class="text-6xl mb-3 animate-float drop-shadow-sm select-none">
              {{ card.emoji }}
            </div>

            <!-- Animal name -->
            <h3 class="text-xl font-black text-slate-700 mb-4 font-fredoka">{{ card.name }}</h3>

            <!-- Hear button -->
            <button
              (click)="speakAnimal(card); $event.stopPropagation()"
              class="w-full rounded-full bg-slate-100 text-pink-500 font-black px-4 py-2 hover:bg-pink-50 transition-colors text-xs uppercase tracking-wider"
            >
              🔊 Hear
            </button>

            <!-- Completed badge -->
            <div *ngIf="isCompleted(i)" class="mt-3 px-3 py-1 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-full text-[10px] font-black tracking-wider uppercase shadow-soft">
              ✓ Learned
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-4 justify-center flex-wrap mt-12">
          <button
            (click)="goBack()"
            class="btn-secondary px-8 py-3.5 rounded-full font-black text-sm"
          >
            ← Back
          </button>
          <button
            *ngIf="completedCount === animalCards.length"
            (click)="completeLearning()"
            class="rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-8 py-3.5 hover:scale-105 active:scale-95 transition-all font-black text-sm shadow-neon animate-pulse-glow"
          >
            ✨ All Done! Earn Reward
          </button>
        </div>
      </div>

      <!-- Animal Info Modal -->
      <div *ngIf="showAnimalModal" class="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="card-floating p-8 max-w-md w-full animate-scale-up text-center relative flex flex-col justify-between">
          <div class="mb-6">
            <p class="text-xs uppercase tracking-widest font-black text-emerald-500 mb-2">Meet the Animal!</p>
            <div class="text-8xl mb-4 animate-bounce-slow drop-shadow-lg select-none">{{ selectedAnimalCard?.emoji }}</div>
            <h3 class="text-4xl font-black text-pink-500 font-fredoka mb-2">{{ selectedAnimalCard?.name }}</h3>
          </div>

          <!-- Animal sound -->
          <div class="bg-gradient-to-r from-amber-100 to-amber-50 rounded-[2rem] p-5 mb-5 border-4 border-amber-300">
            <p class="text-xs font-black uppercase text-amber-600 tracking-wider mb-1">Animal sound</p>
            <p class="text-2xl font-black text-pink-600 font-fredoka mb-3">{{ selectedAnimalCard?.sound }}</p>
            <button
              (click)="speakAnimal(selectedAnimalCard)"
              class="w-full rounded-full bg-pink-500 text-white font-black py-2.5 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-wider shadow-soft"
            >
              🔊 Play Sound
            </button>
          </div>

          <!-- Fun Fact -->
          <div class="bg-gradient-to-r from-sky-100 to-sky-50 rounded-[2rem] p-5 mb-6 border-4 border-sky-300">
            <p class="text-xs font-black uppercase text-sky-600 tracking-wider mb-1">Fun Fact</p>
            <p class="text-sm font-bold text-sky-700 leading-relaxed">{{ selectedAnimalCard?.funFact }}</p>
          </div>

          <!-- Action buttons -->
          <div class="grid grid-cols-2 gap-4">
            <button
              (click)="skipAnimal()"
              class="btn-secondary py-3.5 rounded-full font-black text-sm"
            >
              Skip
            </button>
            <button
              (click)="markAsCompleted()"
              class="rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black py-3.5 hover:scale-105 active:scale-95 transition-all text-sm shadow-soft"
            >
              Got it! ✓
            </button>
          </div>
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
export class AnimalsComponent implements OnInit {
    animalCards: AnimalCard[] = [
        {
            name: 'Lion',
            emoji: '🦁',
            sound: 'Roar!',
            pronunciation: 'lion',
            funFact: 'Lions are the only cats that live in groups called prides!'
        },
        {
            name: 'Elephant',
            emoji: '🐘',
            sound: 'Trumpet!',
            pronunciation: 'elephant',
            funFact: 'Elephants are the largest land animals and have amazing memories!'
        },
        {
            name: 'Monkey',
            emoji: '🐵',
            sound: 'Ooh ooh!',
            pronunciation: 'monkey',
            funFact: 'Monkeys are very smart and love to swing and play!'
        },
        {
            name: 'Penguin',
            emoji: '🐧',
            sound: 'Squawk!',
            pronunciation: 'penguin',
            funFact: 'Penguins are birds that swim instead of fly!'
        },
        {
            name: 'Giraffe',
            emoji: '🦒',
            sound: 'Huff huff!',
            pronunciation: 'giraffe',
            funFact: 'Giraffes are the tallest animals and can reach high leaves!'
        },
        {
            name: 'Panda',
            emoji: '🐼',
            sound: 'Chirp!',
            pronunciation: 'panda',
            funFact: 'Pandas love to eat bamboo and are very cute and cuddly!'
        },
        {
            name: 'Tiger',
            emoji: '🐯',
            sound: 'Growl!',
            pronunciation: 'tiger',
            funFact: 'Tigers have unique stripes like human fingerprints!'
        },
        {
            name: 'Dolphin',
            emoji: '🐬',
            sound: 'Click click!',
            pronunciation: 'dolphin',
            funFact: 'Dolphins are very intelligent and love to play!'
        },
        {
            name: 'Butterfly',
            emoji: '🦋',
            sound: 'Flap flap!',
            pronunciation: 'butterfly',
            funFact: 'Butterflies taste with their feet and have colorful wings!'
        },
        {
            name: 'Whale',
            emoji: '🐋',
            sound: 'Whoooosh!',
            pronunciation: 'whale',
            funFact: 'Whales are the biggest animals on Earth and live in the ocean!'
        },
        {
            name: 'Zebra',
            emoji: '🦓',
            sound: 'Whinny!',
            pronunciation: 'zebra',
            funFact: 'Every zebra has unique black and white stripes!'
        },
        {
            name: 'Owl',
            emoji: '🦉',
            sound: 'Hoo hoo!',
            pronunciation: 'owl',
            funFact: 'Owls can see very well at night and turn their heads far around!'
        },
        {
            name: 'Bear',
            emoji: '🐻',
            sound: 'Growl!',
            pronunciation: 'bear',
            funFact: 'Bears are strong and love to eat honey and fish!'
        },
        {
            name: 'Parrot',
            emoji: '🦜',
            sound: 'Squawk!',
            pronunciation: 'parrot',
            funFact: 'Parrots can copy sounds and learn to say words!'
        },
        {
            name: 'Snake',
            emoji: '🐍',
            sound: 'Hisss!',
            pronunciation: 'snake',
            funFact: 'Snakes smell with their tongues and are amazing hunters!'
        },
        {
            name: 'Fox',
            emoji: '🦊',
            sound: 'Yip yip!',
            pronunciation: 'fox',
            funFact: 'Foxes are clever and quick, with beautiful fluffy tails!'
        },
        {
            name: 'Rabbit',
            emoji: '🐰',
            sound: 'Thump!',
            pronunciation: 'rabbit',
            funFact: 'Rabbits can hop very far and have excellent hearing!'
        },
        {
            name: 'Peacock',
            emoji: '🦚',
            sound: 'Meow meow!',
            pronunciation: 'peacock',
            funFact: 'Male peacocks have beautiful colorful tail feathers!'
        },
        {
            name: 'Flamingo',
            emoji: '🦩',
            sound: 'Honk!',
            pronunciation: 'flamingo',
            funFact: 'Flamingos get their pink color from the food they eat!'
        },
        {
            name: 'Turtle',
            emoji: '🐢',
            sound: 'Hiss!',
            pronunciation: 'turtle',
            funFact: 'Turtles carry their homes on their backs and live a very long time!'
        }
    ];

    selectedAnimalCard: AnimalCard | null = null;
    selectedAnimalIndex: number = -1;
    showAnimalModal: boolean = false;
    showCelebration: boolean = false;
    completedAnimals: Set<number> = new Set();
    completedCount: number = 0;

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
        this.speak('Animal learning is fun!');
    }

    selectAnimal(card: AnimalCard, index: number): void {
        this.selectedAnimalCard = card;
        this.selectedAnimalIndex = index;
        this.showAnimalModal = true;
    }

    closeModal(): void {
        this.showAnimalModal = false;
        this.selectedAnimalCard = null;
        this.selectedAnimalIndex = -1;
    }

    speakAnimal(card: AnimalCard | null | undefined): void {
        if (card) {
            this.speak(card.name);
        }
    }

    markAsCompleted(): void {
        if (this.selectedAnimalIndex >= 0) {
            this.completedAnimals.add(this.selectedAnimalIndex);
            this.completedCount = this.completedAnimals.size;
            const child = this.dataService.getCurrentChild();
            if (child) {
                this.dataService.updateChildProgress(child.id, 'animals', 15);
            }
            this.audio.play('success');
            this.mascot.celebrate('Great listening! New animal learned.');

            setTimeout(() => {
                this.closeModal();
            }, 800);
        }
    }

    skipAnimal(): void {
        this.closeModal();
    }

    isCompleted(index: number): boolean {
        return this.completedAnimals.has(index);
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
        this.mascot.celebrate('Animal Jungle complete!');
        setTimeout(() => {
            this.router.navigate(['/dashboard']);
        }, 2000);
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}
