import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '@core/services/data.service';
import { AudioService } from '@core/services/audio.service';
import { GamificationService, JourneyWorld, Mission } from '@core/services/gamification.service';
import { MascotService } from '@core/services/mascot.service';
import { Child } from '@core/models';
import { JourneyMapComponent } from '@shared/components/journey-map.component';
import { MissionPanelComponent } from '@shared/components/mission-panel.component';
import { PremiumBottomNavComponent } from '@shared/components/premium-bottom-nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, JourneyMapComponent, MissionPanelComponent, PremiumBottomNavComponent],
  template: `
    <div *ngIf="currentChild" class="relative z-10 min-h-screen pb-32">
      <!-- Home Tab View -->
      <ng-container *ngIf="activeTab === 'home'">
        <header class="px-5 pt-8 md:px-10">
          <div class="mx-auto max-w-7xl">
            <div class="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
              <section class="card-floating p-6 md:p-8 overflow-hidden relative flex flex-col justify-between min-h-[300px]">
                <div class="absolute right-6 top-6 hidden md:flex items-center justify-center w-24 h-24 text-7xl animate-float opacity-90 select-none">
                  {{ currentChild.avatar }}
                </div>
                <div>
                  <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">
                    {{ getDayGreeting() }}
                  </p>
                  <h1 class="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-pink-500">
                    {{ currentChild.name }}'s next adventure is ready
                  </h1>
                  <p class="mt-4 max-w-2xl text-base md:text-lg font-bold text-slate-500">
                    Continue your journey, finish missions, and open today's reward chest.
                  </p>
                </div>

                <div class="mt-8 grid grid-cols-3 gap-3 md:max-w-2xl">
                  <div class="rounded-3xl bg-gradient-to-br from-pink-400 to-pink-600 p-4 text-white shadow-soft flex flex-col items-center justify-center">
                    <p class="text-[10px] font-black uppercase opacity-90 tracking-wider">Streak</p>
                    <p class="text-2xl md:text-3xl font-black mt-1">{{ currentChild.streak }}</p>
                  </div>
                  <div class="rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 p-4 text-white shadow-soft flex flex-col items-center justify-center">
                    <p class="text-[10px] font-black uppercase opacity-90 tracking-wider">XP</p>
                    <p class="text-2xl md:text-3xl font-black count-pop mt-1">{{ currentChild.totalXP }}</p>
                  </div>
                  <div class="rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-white shadow-soft flex flex-col items-center justify-center">
                    <p class="text-[10px] font-black uppercase opacity-90 tracking-wider">Coins</p>
                    <p class="text-2xl md:text-3xl font-black mt-1">{{ coins }}</p>
                  </div>
                </div>
              </section>

              <section class="card-floating p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">
                    Level {{ currentChild.level }}
                  </p>
                  <h2 class="text-2xl font-black text-pink-500">
                    Progress to level {{ currentChild.level + 1 }}
                  </h2>
                  <div class="mt-5 h-7 overflow-hidden rounded-full bg-slate-100 border-2 border-white shadow-inner relative">
                    <div class="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 animated-xp transition-all duration-700"
                      [style.width.%]="levelProgress"></div>
                  </div>
                  <p class="mt-3 text-sm font-black text-cyan-500">
                    {{ currentChild.totalXP % 100 }} / 100 XP
                  </p>
                </div>

                <button type="button" (click)="openRewardChest()" 
                  class="mt-6 w-full rounded-[2rem] bg-gradient-to-r from-[#ffa726] to-[#ec407a] px-6 py-4 text-lg font-black text-white shadow-neon hover:scale-105 active:scale-95 transition-all duration-300">
                  Open reward chest
                </button>
              </section>
            </div>
          </div>
        </header>

        <main class="mx-auto max-w-7xl px-5 py-8 md:px-10">
          <section class="mb-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <article class="card-floating p-6 md:p-8">
              <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">Continue learning</p>
              <div class="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
                <button *ngFor="let item of continueItems" type="button" (click)="navigateTo(item.route)"
                  class="min-w-[260px] flex-1 rounded-[2rem] p-6 text-left text-white shadow-soft hover:-translate-y-1 transition-all duration-300 border-4 border-white/20"
                  [ngClass]="item.className">
                  <p class="text-xs font-black uppercase opacity-90 tracking-wider">{{ item.label }}</p>
                  <h3 class="mt-2 text-2xl font-black text-white">{{ item.title }}</h3>
                  <p class="mt-6 text-xs font-black bg-white/20 inline-block px-3 py-1.5 rounded-full uppercase tracking-wider">{{ item.cta }}</p>
                </button>
              </div>
            </article>

            <article class="card-floating p-6 md:p-8">
              <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">
                Recommended for {{ currentChild.name }}
              </p>
              <div class="grid gap-3 sm:grid-cols-2 mt-2">
                <button *ngFor="let recommendation of recommendations" type="button" (click)="mascot.encourage(recommendation)"
                  class="rounded-3xl bg-white p-5 text-left font-black text-pink-500 shadow-soft border-4 border-slate-50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3">
                  <span class="text-2xl text-cyan-400">✨</span>
                  <span class="text-sm font-black">{{ recommendation }}</span>
                </button>
              </div>
            </article>
          </section>

          <app-mission-panel [missions]="missions"></app-mission-panel>

          <section class="mt-10 grid gap-6 lg:grid-cols-3">
            <article class="card-floating p-6 md:p-8 flex flex-col justify-between">
              <div>
                <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">Recently unlocked</p>
                <h2 class="text-2xl font-black text-primary">Star Reader badge 🏆</h2>
                <p class="mt-3 text-sm font-bold text-slate-500">Story practice is building confidence and imagination.</p>
              </div>
            </article>
            <article class="card-floating p-6 md:p-8 flex flex-col justify-between">
              <div>
                <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">Favorite shortcut</p>
                <h2 class="text-2xl font-black text-primary">Puzzle Forest 🌲</h2>
                <p class="mt-3 text-sm font-bold text-slate-500">Sharpen your brain and solve puzzles!</p>
              </div>
              <button type="button" (click)="navigateTo('/puzzle')" 
                class="btn-secondary mt-6 w-full py-3.5 rounded-full font-black text-sm">Play puzzle</button>
            </article>
            <article class="card-floating p-6 md:p-8 flex flex-col justify-between">
              <div>
                <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">Motivation</p>
                <h2 class="text-2xl font-black text-primary">Small wins count ⭐</h2>
                <p class="mt-3 text-sm font-bold text-slate-500">One more activity keeps the streak glowing.</p>
              </div>
            </article>
          </section>
        </main>
      </ng-container>

      <!-- Map Tab View -->
      <ng-container *ngIf="activeTab === 'map'">
        <header class="px-5 pt-8 md:px-10 text-center">
          <div class="mx-auto max-w-7xl">
            <div class="rounded-[2.5rem] bg-white/95 p-6 md:p-8 shadow-soft-lg border-4 border-white inline-block max-w-xl">
              <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-1">LEARNING JOURNEY</p>
              <h1 class="text-3xl md:text-5xl font-black text-primary">
                🗺️ {{ currentChild.name }}'s Adventure Map
              </h1>
              <p class="mt-2 text-slate-500 font-bold text-sm">
                Select an unlocked world below to jump right into the quest!
              </p>
            </div>
          </div>
        </header>

        <main class="mx-auto max-w-7xl px-5 py-8 md:px-10">
          <app-journey-map [worlds]="worlds" (worldSelected)="goToWorld($event)"></app-journey-map>
        </main>
      </ng-container>

      <div *ngIf="chestOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm">
        <div class="relative max-w-sm rounded-[2.5rem] bg-white p-8 text-center shadow-soft-lg border-4 border-accent-yellow animate-scale-up">
          <div class="text-7xl animate-bounce-slow">🎁</div>
          <h2 class="mt-4 text-3xl font-black text-primary">Reward unlocked!</h2>
          <p class="mt-3 font-bold text-slate-600">You earned 50 coins and a glowing star.</p>
          <button type="button" (click)="closeRewardChest()" class="btn-primary mt-6 w-full">Collect</button>
        </div>
      </div>

      <app-premium-bottom-nav></app-premium-bottom-nav>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentChild: Child | null = null;
  worlds: JourneyWorld[] = [];
  missions: Mission[] = [];
  recommendations: string[] = [];
  coins = 0;
  chestOpen = false;
  activeTab = 'home';

  continueItems = [
    { label: 'Continue', title: 'Alphabet Island', cta: 'Resume letter quest', route: '/alphabet', className: 'bg-gradient-to-br from-sky-400 to-cyan-500' },
    { label: 'Needs practice', title: 'Puzzle Forest', cta: 'Solve one checkpoint', route: '/puzzle', className: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
    { label: 'Cozy mode', title: 'Story Castle', cta: 'Listen aloud', route: '/stories', className: 'bg-gradient-to-br from-rose-400 to-fuchsia-500' },
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private gamification: GamificationService,
    private audio: AudioService,
    public mascot: MascotService,
  ) {}

  get levelProgress(): number {
    return this.currentChild ? this.currentChild.totalXP % 100 : 0;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'home';
      if (this.activeTab === 'map') {
        this.mascot.encourage('Check out your Adventure Map! Where shall we go next?');
      }
    });

    this.dataService.currentChild$.subscribe(child => {
      this.currentChild = child;
      this.worlds = this.gamification.getWorlds(child);
      this.missions = this.gamification.getMissions(child);
      this.recommendations = this.gamification.getRecommendations(child);
      this.coins = this.gamification.getCoins(child);
      if (this.activeTab !== 'map') {
        this.mascot.encourage(child ? `Ready for a new adventure, ${child.name}?` : 'Ready for a new adventure?');
      }
    });
  }

  getDayGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning quest';
    if (hour < 18) return 'Afternoon adventure';
    return 'Evening sparkle session';
  }

  goToWorld(world: JourneyWorld): void {
    this.audio.play('swipe');
    this.router.navigate([world.route]);
  }

  navigateTo(route: string): void {
    this.audio.play('tap');
    this.router.navigate([route]);
  }

  openRewardChest(): void {
    this.chestOpen = true;
    this.audio.play('reward');
    this.mascot.celebrate('You unlocked a star!');
  }

  closeRewardChest(): void {
    this.chestOpen = false;
    this.audio.play('success');
  }
}
