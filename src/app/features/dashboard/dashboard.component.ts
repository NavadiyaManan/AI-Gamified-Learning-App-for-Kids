import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
      <header class="px-5 pt-8 md:px-10">
        <div class="mx-auto max-w-7xl">
          <div class="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
            <section class="rounded-[2rem] bg-white/85 p-6 md:p-8 shadow-soft-lg border-4 border-white overflow-hidden relative">
              <div class="absolute right-6 top-6 hidden md:block text-7xl animate-float opacity-80">{{ currentChild.avatar }}</div>
              <p class="section-kicker">{{ getDayGreeting() }}</p>
              <h1 class="text-4xl md:text-6xl font-black leading-tight text-primary">
                {{ currentChild.name }}'s next adventure is ready
              </h1>
              <p class="mt-4 max-w-2xl text-lg font-bold text-slate-600">
                Continue your journey, finish missions, and open today&apos;s reward chest.
              </p>

              <div class="mt-8 grid grid-cols-3 gap-3 md:max-w-2xl">
                <div class="rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 p-4 text-white shadow-soft">
                  <p class="text-xs font-black opacity-90">Streak</p>
                  <p class="text-3xl font-black">{{ currentChild.streak }}</p>
                </div>
                <div class="rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 p-4 text-white shadow-soft">
                  <p class="text-xs font-black opacity-90">XP</p>
                  <p class="text-3xl font-black count-pop">{{ currentChild.totalXP }}</p>
                </div>
                <div class="rounded-3xl bg-gradient-to-br from-amber-300 to-orange-500 p-4 text-white shadow-soft">
                  <p class="text-xs font-black opacity-90">Coins</p>
                  <p class="text-3xl font-black">{{ coins }}</p>
                </div>
              </div>
            </section>

            <section class="rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
              <p class="section-kicker">Level {{ currentChild.level }}</p>
              <h2 class="text-2xl font-black text-primary">Progress to level {{ currentChild.level + 1 }}</h2>
              <div class="mt-5 h-7 overflow-hidden rounded-full bg-slate-200">
                <div class="h-full rounded-full bg-gradient-to-r from-accent-yellow via-primary to-accent-green animated-xp"
                  [style.width.%]="levelProgress"></div>
              </div>
              <p class="mt-3 text-sm font-black text-secondary">{{ currentChild.totalXP % 100 }} / 100 XP</p>

              <button type="button" (click)="openRewardChest()" class="mt-8 w-full rounded-3xl bg-gradient-to-br from-accent-yellow to-primary px-5 py-5 text-xl font-black text-white shadow-neon hover:scale-105 active:scale-95">
                Open reward chest
              </button>
            </section>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-7xl px-5 py-8 md:px-10">
        <section class="mb-8 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <article class="rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
            <p class="section-kicker">Continue learning</p>
            <div class="flex gap-4 overflow-x-auto pb-2">
              <button *ngFor="let item of continueItems" type="button" (click)="navigateTo(item.route)"
                class="min-w-64 rounded-3xl p-5 text-left text-white shadow-soft hover:-translate-y-1"
                [ngClass]="item.className">
                <p class="text-sm font-black opacity-90">{{ item.label }}</p>
                <h3 class="mt-2 text-2xl font-black text-white">{{ item.title }}</h3>
                <p class="mt-5 text-sm font-bold opacity-90">{{ item.cta }}</p>
              </button>
            </div>
          </article>

          <article class="rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
            <p class="section-kicker">Recommended for {{ currentChild.name }}</p>
            <div class="grid gap-3 sm:grid-cols-2">
              <button *ngFor="let recommendation of recommendations" type="button" (click)="mascot.encourage(recommendation)"
                class="rounded-3xl bg-gradient-to-r from-white to-cyan-50 p-4 text-left font-black text-primary shadow-soft border border-white hover:-translate-y-1">
                {{ recommendation }}
              </button>
            </div>
          </article>
        </section>

        <app-mission-panel [missions]="missions"></app-mission-panel>

        <div class="mt-10">
          <app-journey-map [worlds]="worlds" (worldSelected)="goToWorld($event)"></app-journey-map>
        </div>

        <section class="mt-10 grid gap-5 lg:grid-cols-3">
          <article class="rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
            <p class="section-kicker">Recently unlocked</p>
            <h2 class="text-2xl font-black text-primary">Star Reader badge</h2>
            <p class="mt-3 font-bold text-slate-600">Story practice is building confidence and imagination.</p>
          </article>
          <article class="rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
            <p class="section-kicker">Favorite shortcut</p>
            <h2 class="text-2xl font-black text-primary">Puzzle Forest</h2>
            <button type="button" (click)="navigateTo('/puzzle')" class="btn-secondary mt-5 w-full">Play puzzle</button>
          </article>
          <article class="rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
            <p class="section-kicker">Motivation</p>
            <h2 class="text-2xl font-black text-primary">Small wins count</h2>
            <p class="mt-3 font-bold text-slate-600">One more activity keeps the streak glowing.</p>
          </article>
        </section>
      </main>

      <div *ngIf="chestOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm">
        <div class="relative max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-soft-lg border-4 border-accent-yellow animate-scale-up">
          <div class="text-7xl animate-bounce-slow">Chest</div>
          <h2 class="mt-4 text-3xl font-black text-primary">Reward unlocked!</h2>
          <p class="mt-3 font-bold text-slate-600">You earned 50 coins and a glowing star.</p>
          <button type="button" (click)="closeRewardChest()" class="btn-primary mt-6 w-full">Collect</button>
        </div>
      </div>

      <app-premium-bottom-nav></app-premium-bottom-nav>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  currentChild: Child | null = null;
  worlds: JourneyWorld[] = [];
  missions: Mission[] = [];
  recommendations: string[] = [];
  coins = 0;
  chestOpen = false;

  continueItems = [
    { label: 'Continue', title: 'Alphabet Island', cta: 'Resume letter quest', route: '/alphabet', className: 'bg-gradient-to-br from-sky-400 to-cyan-500' },
    { label: 'Needs practice', title: 'Puzzle Forest', cta: 'Solve one checkpoint', route: '/puzzle', className: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
    { label: 'Cozy mode', title: 'Story Castle', cta: 'Listen aloud', route: '/stories', className: 'bg-gradient-to-br from-rose-400 to-fuchsia-500' },
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private gamification: GamificationService,
    private audio: AudioService,
    public mascot: MascotService,
  ) {}

  get levelProgress(): number {
    return this.currentChild ? this.currentChild.totalXP % 100 : 0;
  }

  ngOnInit(): void {
    this.dataService.currentChild$.subscribe(child => {
      this.currentChild = child;
      this.worlds = this.gamification.getWorlds(child);
      this.missions = this.gamification.getMissions(child);
      this.recommendations = this.gamification.getRecommendations(child);
      this.coins = this.gamification.getCoins(child);
      this.mascot.encourage(child ? `Ready for a new adventure, ${child.name}?` : 'Ready for a new adventure?');
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
