import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '@core/services/data.service';
import { AudioService } from '@core/services/audio.service';
import { GamificationService, InventoryItem } from '@core/services/gamification.service';
import { MascotService } from '@core/services/mascot.service';
import { Achievement, Child } from '@core/models';
import { PremiumBottomNavComponent } from '@shared/components/premium-bottom-nav.component';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, PremiumBottomNavComponent],
  template: `
    <div class="relative z-10 min-h-screen pb-32">
      <header class="px-5 pt-8 md:px-10">
        <div class="mx-auto max-w-7xl rounded-[2rem] bg-white/85 p-6 md:p-8 shadow-soft-lg border-4 border-white">
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="section-kicker">Reward room</p>
              <h1 class="text-4xl md:text-6xl font-black text-primary">Badges, coins, and treasures</h1>
            </div>
            <button type="button" (click)="openChest()" class="rounded-3xl bg-gradient-to-br from-accent-yellow to-primary px-6 py-4 font-black text-white shadow-neon">
              Open chest
            </button>
          </div>

          <div class="mt-8 grid gap-4 md:grid-cols-4">
            <div class="reward-stat"><span>Badges</span><strong>{{ unlockedAchievements.length }}</strong></div>
            <div class="reward-stat"><span>Coins</span><strong>{{ coins }}</strong></div>
            <div class="reward-stat"><span>Trophies</span><strong>{{ trophyCount }}</strong></div>
            <div class="reward-stat"><span>Level</span><strong>{{ currentChild?.level || 1 }}</strong></div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-7xl px-5 py-8 md:px-10">
        <section class="grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <article class="rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
            <p class="section-kicker">Unlocked achievements</p>
            <div *ngIf="unlockedAchievements.length; else noRewards" class="grid gap-4 md:grid-cols-2">
              <div *ngFor="let achievement of unlockedAchievements" class="rounded-3xl bg-gradient-to-br from-white to-yellow-50 p-5 shadow-soft border-4 border-accent-yellow hover:-translate-y-1">
                <div class="text-4xl">{{ achievement.icon }}</div>
                <h2 class="mt-3 text-xl font-black text-primary">{{ achievement.name }}</h2>
                <p class="mt-2 text-sm font-bold text-slate-600">{{ achievement.description }}</p>
                <p class="mt-4 text-xs font-black text-secondary">Unlocked {{ achievement.unlockedDate | date:'MMM d' }}</p>
              </div>
            </div>
            <ng-template #noRewards>
              <div class="rounded-3xl bg-cyan-50 p-8 text-center">
                <div class="text-6xl animate-float">Star</div>
                <h2 class="mt-4 text-2xl font-black text-primary">No rewards yet</h2>
                <p class="mt-2 font-bold text-slate-600">Finish a tiny mission to unlock your first badge.</p>
                <button type="button" (click)="goBack()" class="btn-primary mt-5">Start mission</button>
              </div>
            </ng-template>
          </article>

          <article class="rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
            <p class="section-kicker">Locked badges</p>
            <div class="space-y-4">
              <div *ngFor="let achievement of lockedAchievements" class="rounded-3xl bg-slate-50 p-4 shadow-soft">
                <div class="flex items-center gap-4">
                  <div class="text-3xl grayscale">{{ achievement.icon }}</div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-base font-black text-slate-600">{{ achievement.name }}</h3>
                    <div class="progress-track">
                      <div class="progress-fill" [style.width.%]="achievement.progress"></div>
                    </div>
                  </div>
                  <strong class="text-sm text-secondary">{{ achievement.progress }}%</strong>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section class="mt-8 rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
          <p class="section-kicker">Avatar inventory</p>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <button *ngFor="let item of inventory" type="button"
              class="rounded-3xl p-5 text-center shadow-soft border-4"
              [ngClass]="item.unlocked ? 'bg-gradient-to-br from-white to-green-50 border-accent-green' : 'bg-slate-100 border-white grayscale opacity-70'"
              (click)="item.unlocked ? mascot.celebrate(item.name + ' equipped!') : mascot.encourage('Keep learning to unlock ' + item.name)">
              <div class="text-3xl font-black text-primary">{{ item.icon }}</div>
              <h3 class="mt-3 text-sm font-black text-primary">{{ item.name }}</h3>
              <p class="mt-1 text-xs font-bold text-slate-500">{{ item.unlocked ? 'Unlocked' : 'Locked' }}</p>
            </button>
          </div>
        </section>

        <section class="mt-8 rounded-[2rem] bg-white/85 p-6 shadow-soft-lg border-4 border-white">
          <p class="section-kicker">Trophy wall</p>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div *ngFor="let trophy of trophies; let i = index" class="rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-50 p-6 text-center shadow-soft border-4 border-white">
              <div class="text-5xl animate-float">Cup</div>
              <h3 class="mt-3 text-lg font-black text-primary">Level {{ (i + 1) * 5 }}</h3>
              <p class="text-xs font-bold text-secondary">{{ currentChild && currentChild.level >= (i + 1) * 5 ? 'Unlocked' : 'Locked' }}</p>
            </div>
          </div>
        </section>
      </main>

      <div *ngIf="chestOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm">
        <div class="rounded-[2rem] bg-white p-8 text-center shadow-soft-lg border-4 border-accent-yellow animate-scale-up">
          <div class="text-7xl animate-bounce-slow">Chest</div>
          <h2 class="mt-4 text-3xl font-black text-primary">Treasure claimed</h2>
          <p class="mt-3 font-bold text-slate-600">25 bonus coins added to your adventure wallet.</p>
          <button type="button" (click)="closeChest()" class="btn-primary mt-6 w-full">Collect</button>
        </div>
      </div>

      <app-premium-bottom-nav></app-premium-bottom-nav>
    </div>
  `,
})
export class RewardsComponent implements OnInit {
  currentChild: Child | null = null;
  achievements: Achievement[] = [];
  unlockedAchievements: Achievement[] = [];
  lockedAchievements: Achievement[] = [];
  inventory: InventoryItem[] = [];
  coins = 0;
  trophyCount = 0;
  chestOpen = false;
  trophies = [1, 2, 3, 4];

  constructor(
    private dataService: DataService,
    private gamification: GamificationService,
    private audio: AudioService,
    public mascot: MascotService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.achievements = this.dataService.getAchievements();
    this.unlockedAchievements = this.achievements.filter(a => !a.isLocked);
    this.lockedAchievements = this.achievements.filter(a => a.isLocked);

    this.dataService.currentChild$.subscribe(child => {
      this.currentChild = child;
      this.inventory = this.gamification.getInventory(child);
      this.coins = this.gamification.getCoins(child);
      this.trophyCount = this.trophies.filter((_, index) => (child?.level ?? 1) >= (index + 1) * 5).length;
    });
  }

  openChest(): void {
    this.chestOpen = true;
    this.audio.play('reward');
    this.mascot.celebrate('Treasure time!');
  }

  closeChest(): void {
    this.chestOpen = false;
    this.audio.play('success');
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
