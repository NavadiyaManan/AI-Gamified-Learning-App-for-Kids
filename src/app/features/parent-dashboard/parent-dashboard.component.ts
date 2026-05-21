import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '@core/services/data.service';
import { ReportService } from '@core/services/report.service';
import { ParentAnalytics, DailyStats, Child } from '@core/models';

@Component({
    selector: 'app-parent-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-pastel-purple via-pastel-blue to-pastel-pink pb-24 md:pb-12">
      <!-- Header with Child Selector -->
      <div class="bg-gradient-to-r from-primary via-secondary to-primary p-6 md:p-8 shadow-soft-lg">
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-white">Parent Dashboard 👨‍👩‍👧‍👦</h1>
            </div>
            <button (click)="goBack()" class="btn-icon bg-white text-primary hover:bg-gray-100">
              ✕
            </button>
          </div>

          <!-- Child Selector -->
          <div class="flex flex-col md:flex-row gap-4 items-center">
            <label class="text-white font-bold text-lg">Select Child:</label>
            <select 
              [(ngModel)]="selectedChildId" 
              (change)="onChildSelected()" 
              class="px-6 py-2 rounded-2xl border-2 border-white bg-white text-primary font-bold text-lg cursor-pointer focus:outline-none"
            >
              <option value="" disabled>-- Choose a child --</option>
              <option *ngFor="let child of allChildren" [value]="child.id">
                {{ child.name }} ({{ child.age }} years) {{ currentChild?.id === child.id ? '✓' : '' }}
              </option>
            </select>
            <p class="text-white opacity-90 font-semibold text-lg">
              {{ currentChild ? currentChild.name + "'s Learning Progress" : 'No child selected' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Subject Analytics Tabs -->
      <div class="bg-white shadow-soft-lg sticky top-0 z-10">
        <div class="max-w-6xl mx-auto px-6 md:px-8 py-4 flex overflow-x-auto gap-2 md:gap-4">
          <button 
            (click)="selectedTab = 'overview'" 
            [class.active]="selectedTab === 'overview'"
            class="px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300"
            [ngClass]="selectedTab === 'overview' ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-primary hover:bg-gray-300'"
          >
            📊 Overview
          </button>
          <button 
            (click)="selectedTab = 'alphabets'" 
            [class.active]="selectedTab === 'alphabets'"
            class="px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300"
            [ngClass]="selectedTab === 'alphabets' ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-primary hover:bg-gray-300'"
          >
            🔤 Alphabets
          </button>
          <button 
            (click)="selectedTab = 'numbers'" 
            [class.active]="selectedTab === 'numbers'"
            class="px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300"
            [ngClass]="selectedTab === 'numbers' ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-primary hover:bg-gray-300'"
          >
            🔢 Numbers
          </button>
          <button 
            (click)="selectedTab = 'animals'" 
            [class.active]="selectedTab === 'animals'"
            class="px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300"
            [ngClass]="selectedTab === 'animals' ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-primary hover:bg-gray-300'"
          >
            🦁 Animals
          </button>
          <button 
            (click)="selectedTab = 'puzzles'" 
            [class.active]="selectedTab === 'puzzles'"
            class="px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300"
            [ngClass]="selectedTab === 'puzzles' ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-primary hover:bg-gray-300'"
          >
            🧩 Puzzles
          </button>
          <button 
            (click)="selectedTab = 'stories'" 
            [class.active]="selectedTab === 'stories'"
            class="px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300"
            [ngClass]="selectedTab === 'stories' ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-primary hover:bg-gray-300'"
          >
            📖 Stories
          </button>
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-6xl mx-auto px-6 md:px-8 py-8">
        <!-- OVERVIEW TAB -->
        <div *ngIf="selectedTab === 'overview'">
          <!-- Daily Rewards Section -->
          <div class="card-floating p-8 mb-12 shadow-soft-lg bg-gradient-to-r from-yellow-50 to-orange-50">
            <h2 class="text-3xl font-bold text-primary mb-8">🎁 Daily Rewards</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Daily Streak -->
              <div class="bg-gradient-to-br from-red-100 to-orange-50 rounded-2xl p-6 border-3 border-warning">
                <div class="text-center">
                  <div class="text-6xl mb-3">🔥</div>
                  <p class="text-sm font-bold text-gray-600 mb-2">Daily Streak</p>
                  <p class="text-4xl font-bold text-warning">{{ currentChild?.streak || 0 }}</p>
                  <p class="text-xs text-secondary mt-2">Days in a row</p>
                </div>
              </div>
              
              <!-- Weekly Bonus -->
              <div class="bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl p-6 border-3 border-success">
                <div class="text-center">
                  <div class="text-6xl mb-3">🏆</div>
                  <p class="text-sm font-bold text-gray-600 mb-2">Weekly Bonus</p>
                  <p class="text-4xl font-bold text-success">{{ getWeeklyBonusXP() }}</p>
                  <p class="text-xs text-secondary mt-2">XP Earned</p>
                </div>
              </div>
              
              <!-- Total Points -->
              <div class="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl p-6 border-3 border-primary">
                <div class="text-center">
                  <div class="text-6xl mb-3">⭐</div>
                  <p class="text-sm font-bold text-gray-600 mb-2">Total Points</p>
                  <p class="text-4xl font-bold text-primary">{{ currentChild?.totalXP || 0 }}</p>
                  <p class="text-xs text-secondary mt-2">All time</p>
                </div>
              </div>
              
              <!-- Next Reward -->
              <div class="bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl p-6 border-3 border-secondary">
                <div class="text-center">
                  <div class="text-6xl mb-3">🎊</div>
                  <p class="text-sm font-bold text-gray-600 mb-2">Next Reward</p>
                  <p class="text-4xl font-bold text-secondary">{{ getNextRewardXP() }}</p>
                  <p class="text-xs text-secondary mt-2">XP to next level</p>
                </div>
              </div>
            </div>
          </div>

        <!-- Quick stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div class="card-floating p-6 text-center border-4 border-accent-green shadow-neon">
            <div class="text-5xl mb-3 animate-float">⏱️</div>
            <p class="text-xs text-gray-600 font-semibold mb-2">Total Learning Time</p>
            <p class="text-3xl font-bold text-primary">{{ analytics?.totalLearningTime }}m</p>
            <p class="text-xs text-secondary mt-1">This Week</p>
          </div>
          <div class="card-floating p-6 text-center border-4 border-accent-yellow shadow-neon">
            <div class="text-5xl mb-3 animate-float" style="animation-delay: 0.2s">📅</div>
            <p class="text-xs text-gray-600 font-semibold mb-2">Active Days</p>
            <p class="text-3xl font-bold text-secondary">{{ analytics?.weeklyActiveDay }}/7</p>
            <p class="text-xs text-secondary mt-1">Days This Week</p>
          </div>
          <div class="card-floating p-6 text-center border-4 border-warning shadow-neon">
            <div class="text-5xl mb-3 animate-float" style="animation-delay: 0.4s">⏰</div>
            <p class="text-xs text-gray-600 font-semibold mb-2">Avg Session</p>
            <p class="text-3xl font-bold text-warning">{{ analytics?.averageSessionDuration }}m</p>
            <p class="text-xs text-secondary mt-1">Per Session</p>
          </div>
          <div class="card-floating p-6 text-center border-4 border-primary shadow-neon">
            <div class="text-5xl mb-3 animate-float" style="animation-delay: 0.6s">📍</div>
            <p class="text-xs text-gray-600 font-semibold mb-2">Last Session</p>
            <p class="text-sm font-bold text-primary">Today</p>
            <p class="text-xs text-secondary mt-1">{{ analytics?.lastSessionDate | date: 'short' }}</p>
          </div>
        </div>

        <!-- Premium parent insights -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_.8fr] gap-6 mb-12">
          <div class="card-floating p-8 shadow-soft-lg bg-white/90">
            <h2 class="text-2xl font-bold text-primary mb-6">AI Learning Insights</h2>
            <div class="space-y-4">
              <div *ngFor="let insight of getAiInsights()" class="rounded-3xl bg-gradient-to-r from-white to-cyan-50 p-5 border border-white shadow-soft">
                <p class="font-bold text-primary">{{ insight.title }}</p>
                <p class="text-sm text-secondary font-semibold mt-2">{{ insight.body }}</p>
              </div>
            </div>
          </div>

          <div class="card-floating p-8 shadow-soft-lg bg-white/90">
            <h2 class="text-2xl font-bold text-primary mb-6">Habit Heatmap</h2>
            <div class="grid grid-cols-7 gap-2 mb-6">
              <div *ngFor="let day of analytics?.weeklyStats" class="aspect-square rounded-2xl shadow-soft flex items-center justify-center text-xs font-black text-white"
                [ngClass]="getHeatmapClass(day.learningTime)"
                [title]="day.learningTime + ' minutes'">
                {{ getDayLabel(day.date) }}
              </div>
            </div>
            <label class="block text-sm font-bold text-primary mb-2">Daily screen time goal</label>
            <input [(ngModel)]="screenTimeGoal" type="range" min="10" max="60" step="5" class="w-full" aria-label="Daily screen time goal">
            <p class="text-sm font-bold text-secondary mt-2">{{ screenTimeGoal }} minutes per day</p>
          </div>
        </div>

        <!-- Weekly activity chart -->
        <div class="card-floating p-8 mb-12 shadow-soft-lg">
          <h2 class="text-2xl font-bold text-primary mb-6">📊 Weekly Learning Activity</h2>

          <!-- Chart bars -->
          <div class="flex items-end justify-between h-64 gap-2 mb-6 bg-gradient-to-t from-pastel-blue to-transparent rounded-2xl p-6">
            <div *ngFor="let day of analytics?.weeklyStats" class="flex-1 flex flex-col items-center gap-2">
              <div
                class="w-full bg-gradient-to-t from-primary to-secondary rounded-t-2xl transition-all duration-300 hover:shadow-soft hover:from-secondary hover:to-primary transform hover:scale-105"
                [style.height.%]="(day.learningTime / 40) * 100"
                [title]="day.learningTime + ' minutes'"
              ></div>
              <p class="text-xs font-bold text-primary mt-2">{{ getDayLabel(day.date) }}</p>
              <p class="text-xs text-secondary font-semibold">{{ day.learningTime }}m</p>
            </div>
          </div>

          <p class="text-sm text-gray-600 text-center font-semibold">Your child is showing great consistency! Keep it up! 🌟</p>
        </div>

        <!-- Subject progress -->
        <div class="card-floating p-8 mb-12 shadow-soft-lg">
          <h2 class="text-2xl font-bold text-primary mb-6">📚 Subject Progress</h2>

          <div class="space-y-6">
            <div *ngFor="let subject of getSubjectProgresses()" class="flex items-center gap-4">
              <div class="text-3xl" style="width: 40px">{{ subject.icon }}</div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-bold text-primary">{{ subject.name }}</p>
                  <p class="text-sm font-bold text-secondary">{{ subject.progress }}%</p>
                </div>
                <div class="bg-gray-300 rounded-full h-4 overflow-hidden shadow-soft">
                  <div
                    class="bg-gradient-to-r from-primary to-secondary h-full animate-pulse-glow transition-all duration-500"
                    [style.width.%]="subject.progress"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Weak subjects section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <!-- Needs attention -->
          <div class="card-floating p-8 border-4 border-warning bg-gradient-to-br from-orange-50 to-transparent">
            <h3 class="text-xl font-bold text-primary mb-6">⚠️ Needs Attention</h3>
            <div class="space-y-4">
              <div class="bg-white rounded-2xl p-4 border-2 border-warning">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-bold text-primary">🧩 Puzzles</p>
                  <p class="text-sm font-bold text-warning">33%</p>
                </div>
                <p class="text-sm text-secondary font-semibold">Only 5 of 15 puzzles completed</p>
              </div>
              <div class="bg-white rounded-2xl p-4 border-2 border-warning">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-bold text-primary">📖 Stories</p>
                  <p class="text-sm font-bold text-warning">30%</p>
                </div>
                <p class="text-sm text-secondary font-semibold">Encourage more story time</p>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="card-floating p-8 border-4 border-accent-green bg-gradient-to-br from-green-50 to-transparent">
            <h3 class="text-xl font-bold text-primary mb-6">💡 Recommendations</h3>
            <div class="space-y-4">
              <div class="bg-white rounded-2xl p-4">
                <p class="font-bold text-primary mb-2">✓ Great Progress!</p>
                <p class="text-sm text-secondary font-semibold">Emma has completed all alphabets and numbers. Continue with animals!</p>
              </div>
              <div class="bg-white rounded-2xl p-4">
                <p class="font-bold text-primary mb-2">✓ Daily Streaks</p>
                <p class="text-sm text-secondary font-semibold">Maintain the 7-day streak for special rewards!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance details -->
        <div class="card-floating p-8 shadow-soft-lg">
          <h2 class="text-2xl font-bold text-primary mb-6">📈 Performance Details</h2>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="font-bold text-primary mb-3">🎯 XP Earned This Week</p>
                <div class="flex items-baseline gap-2">
                  <p class="text-4xl font-bold text-secondary">1,120</p>
                  <p class="text-sm text-green-600 font-semibold">↑ 15% from last week</p>
                </div>
              </div>
              <div>
                <p class="font-bold text-primary mb-3">🏆 Achievements Unlocked</p>
                <div class="flex items-baseline gap-2">
                  <p class="text-4xl font-bold text-primary">5</p>
                  <p class="text-sm text-green-600 font-semibold">↑ 2 new this week</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-pastel-green to-green-50 rounded-2xl p-6">
              <p class="font-bold text-primary mb-2">🎓 Overall Assessment</p>
              <p class="text-secondary font-semibold">
                {{ currentChild?.name }} is progressing excellently! She shows strong engagement with alphabets and numbers. 
                Encourage more puzzle and story sessions to build critical thinking skills.
              </p>
            </div>
          </div>
        </div>
        </div> <!-- End Overview Tab -->

        <!-- ALPHABETS TAB -->
        <div *ngIf="selectedTab === 'alphabets'">
          <div class="card-floating p-8 mb-12 shadow-soft-lg">
            <h2 class="text-3xl font-bold text-primary mb-8">🔤 Alphabets Learning Progress</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl p-6 border-3 border-primary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Completed</p>
                <p class="text-5xl font-bold text-primary">{{ currentChild?.learningProgress?.alphabets?.completed || 0 }}/26</p>
              </div>
              <div class="bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl p-6 border-3 border-success text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Progress</p>
                <p class="text-5xl font-bold text-success">{{ getProgress('alphabets') }}%</p>
              </div>
              <div class="bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl p-6 border-3 border-secondary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Time Spent</p>
                <p class="text-5xl font-bold text-secondary">{{ getSubjectTimeSpent('Alphabets') }}m</p>
              </div>
            </div>
            <div class="bg-gray-200 rounded-full h-6 overflow-hidden shadow-soft mb-4">
              <div class="bg-gradient-to-r from-primary to-secondary h-full animate-pulse-glow" [style.width.%]="getProgress('alphabets')"></div>
            </div>
            <p class="text-center text-secondary font-semibold">Keep learning new letters every day! 🌟</p>
          </div>
        </div>

        <!-- NUMBERS TAB -->
        <div *ngIf="selectedTab === 'numbers'">
          <div class="card-floating p-8 mb-12 shadow-soft-lg">
            <h2 class="text-3xl font-bold text-primary mb-8">🔢 Numbers Learning Progress</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl p-6 border-3 border-primary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Completed</p>
                <p class="text-5xl font-bold text-primary">{{ currentChild?.learningProgress?.numbers?.completed || 0 }}/10</p>
              </div>
              <div class="bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl p-6 border-3 border-success text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Progress</p>
                <p class="text-5xl font-bold text-success">{{ getProgress('numbers') }}%</p>
              </div>
              <div class="bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl p-6 border-3 border-secondary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Time Spent</p>
                <p class="text-5xl font-bold text-secondary">{{ getSubjectTimeSpent('Numbers') }}m</p>
              </div>
            </div>
            <div class="bg-gray-200 rounded-full h-6 overflow-hidden shadow-soft mb-4">
              <div class="bg-gradient-to-r from-primary to-secondary h-full animate-pulse-glow" [style.width.%]="getProgress('numbers')"></div>
            </div>
            <p class="text-center text-secondary font-semibold">Counting is becoming easier! Keep practicing! 🎯</p>
          </div>
        </div>

        <!-- ANIMALS TAB -->
        <div *ngIf="selectedTab === 'animals'">
          <div class="card-floating p-8 mb-12 shadow-soft-lg">
            <h2 class="text-3xl font-bold text-primary mb-8">🦁 Animals Learning Progress</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl p-6 border-3 border-primary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Completed</p>
                <p class="text-5xl font-bold text-primary">{{ currentChild?.learningProgress?.animals?.completed || 0 }}/20</p>
              </div>
              <div class="bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl p-6 border-3 border-success text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Progress</p>
                <p class="text-5xl font-bold text-success">{{ getProgress('animals') }}%</p>
              </div>
              <div class="bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl p-6 border-3 border-secondary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Time Spent</p>
                <p class="text-5xl font-bold text-secondary">{{ getSubjectTimeSpent('Animals') }}m</p>
              </div>
            </div>
            <div class="bg-gray-200 rounded-full h-6 overflow-hidden shadow-soft mb-4">
              <div class="bg-gradient-to-r from-primary to-secondary h-full animate-pulse-glow" [style.width.%]="getProgress('animals')"></div>
            </div>
            <p class="text-center text-secondary font-semibold">Learning about animals is fun! 🦒🐸🐘</p>
          </div>
        </div>

        <!-- PUZZLES TAB -->
        <div *ngIf="selectedTab === 'puzzles'">
          <div class="card-floating p-8 mb-12 shadow-soft-lg">
            <h2 class="text-3xl font-bold text-primary mb-8">🧩 Puzzles Learning Progress</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl p-6 border-3 border-primary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Completed</p>
                <p class="text-5xl font-bold text-primary">{{ currentChild?.learningProgress?.puzzles?.completed || 0 }}/15</p>
              </div>
              <div class="bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl p-6 border-3 border-success text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Progress</p>
                <p class="text-5xl font-bold text-success">{{ getProgress('puzzles') }}%</p>
              </div>
              <div class="bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl p-6 border-3 border-secondary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Time Spent</p>
                <p class="text-5xl font-bold text-secondary">{{ getSubjectTimeSpent('Puzzles') }}m</p>
              </div>
            </div>
            <div class="bg-gray-200 rounded-full h-6 overflow-hidden shadow-soft mb-4">
              <div class="bg-gradient-to-r from-primary to-secondary h-full animate-pulse-glow" [style.width.%]="getProgress('puzzles')"></div>
            </div>
            <p class="text-center text-secondary font-semibold">Problem solving skills are improving! 🧠✨</p>
          </div>
        </div>

        <!-- STORIES TAB -->
        <div *ngIf="selectedTab === 'stories'">
          <div class="card-floating p-8 mb-12 shadow-soft-lg">
            <h2 class="text-3xl font-bold text-primary mb-8">📖 Stories Learning Progress</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl p-6 border-3 border-primary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Completed</p>
                <p class="text-5xl font-bold text-primary">{{ currentChild?.learningProgress?.stories?.completed || 0 }}/12</p>
              </div>
              <div class="bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl p-6 border-3 border-success text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Progress</p>
                <p class="text-5xl font-bold text-success">{{ getProgress('stories') }}%</p>
              </div>
              <div class="bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl p-6 border-3 border-secondary text-center">
                <p class="text-sm font-bold text-gray-600 mb-2">Time Spent</p>
                <p class="text-5xl font-bold text-secondary">{{ getSubjectTimeSpent('Stories') }}m</p>
              </div>
            </div>
            <div class="bg-gray-200 rounded-full h-6 overflow-hidden shadow-soft mb-4">
              <div class="bg-gradient-to-r from-primary to-secondary h-full animate-pulse-glow" [style.width.%]="getProgress('stories')"></div>
            </div>
            <p class="text-center text-secondary font-semibold">Imagination and reading skills are growing! 📚💭</p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-4 justify-center mt-12 flex-wrap">
          <button
            (click)="downloadReport()"
            class="btn-primary px-6 py-3"
          >
            📥 Download Report
          </button>
          <button
            (click)="printReport()"
            class="btn-secondary px-6 py-3"
          >
            🖨️ Print Report
          </button>
          <button
            (click)="goBack()"
            class="btn-secondary px-6 py-3"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class ParentDashboardComponent implements OnInit {
    analytics: ParentAnalytics | null = null;
    currentChild: Child | null = null;
    allChildren: Child[] = [];
    selectedChildId: string = '';
    selectedTab: string = 'overview';
    screenTimeGoal: number = 25;

    constructor(
        private dataService: DataService,
        private reportService: ReportService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.dataService.children$.subscribe(children => {
            this.allChildren = children;
            if (children.length > 0 && !this.selectedChildId) {
                this.selectedChildId = children[0].id;
                this.onChildSelected();
            }
        });

        this.dataService.currentChild$.subscribe(child => {
            this.currentChild = child;
            if (child) {
                this.selectedChildId = child.id;
            }
        });

        this.dataService.analytics$.subscribe(analytics => {
            this.analytics = analytics;
        });
    }

    onChildSelected(): void {
        const selectedChild = this.allChildren.find(c => c.id === this.selectedChildId);
        if (selectedChild) {
            this.dataService.setCurrentChild(selectedChild);
        }
    }

    getWeeklyBonusXP(): number {
        if (!this.currentChild) return 0;
        // Base XP for the week multiplied by streak bonus
        return Math.floor(500 * (1 + (this.currentChild.streak * 0.1)));
    }

    getNextRewardXP(): number {
        if (!this.currentChild) return 0;
        // Calculate XP needed for next level
        const currentLevelXPNeeded = this.currentChild.level * 500;
        const remaining = Math.max(0, currentLevelXPNeeded - (this.currentChild.totalXP % currentLevelXPNeeded));
        return remaining;
    }

    getProgress(subject: string): number {
        if (!this.currentChild?.learningProgress) return 0;

        const progress = this.currentChild.learningProgress as any;
        const subjectData = progress[subject];
        if (!subjectData) return 0;

        return Math.floor((subjectData.completed / subjectData.total) * 100);
    }

    getSubjectTimeSpent(subject: string): number {
        if (!this.analytics?.subjectsProgress) return 0;

        // Simulate time spent based on progress
        const progress = this.analytics.subjectsProgress[subject] || 0;
        return Math.floor(progress * 2); // 2 minutes per percentage point
    }

    getSubjectProgresses(): any[] {
        if (!this.analytics?.subjectsProgress) return [];

        return Object.entries(this.analytics.subjectsProgress).map(([subject, progress]) => {
            const icons: { [key: string]: string } = {
                'Alphabets': '🔤',
                'Numbers': '🔢',
                'Animals': '🦁',
                'Puzzles': '🧩',
                'Stories': '📖',
            };

            return {
                name: subject,
                progress: progress,
                icon: icons[subject] || '⭐',
            };
        });
    }

    getDayLabel(dateString: string): string {
        const date = new Date(dateString);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        return day.substring(0, 1);
    }

    getHeatmapClass(minutes: number): string {
        if (minutes >= this.screenTimeGoal) return 'bg-gradient-to-br from-accent-green to-secondary';
        if (minutes >= this.screenTimeGoal * 0.6) return 'bg-gradient-to-br from-accent-yellow to-warning';
        return 'bg-gradient-to-br from-danger to-primary';
    }

    getAiInsights(): { title: string; body: string }[] {
        const childName = this.currentChild?.name || 'Your child';
        return [
            {
                title: `${childName} learns best in short bursts`,
                body: 'Recent activity suggests 20-30 minute sessions keep engagement high without overload.',
            },
            {
                title: 'Practice recommendation',
                body: 'Puzzles and stories are the weakest areas, so rotate one puzzle with one read-aloud session.',
            },
            {
                title: 'Habit signal',
                body: 'The streak is strong. Offer rewards after small wins instead of waiting for long sessions.',
            },
        ];
    }

    generateReport(): void {
        alert('Report generation - PDF would be created and downloaded');
    }

    downloadReport(): void {
        if (!this.currentChild || !this.analytics) {
            alert('No data available to generate report.');
            return;
        }

        const report = this.reportService.generateChildProgressReport(this.currentChild, this.analytics);
        this.reportService.downloadReport(`${this.currentChild.name}_progress_report.txt`, report);
    }

    printReport(): void {
        if (!this.currentChild || !this.analytics) {
            alert('No data available to generate report.');
            return;
        }

        const report = this.reportService.generateChildProgressReport(this.currentChild, this.analytics);
        this.reportService.printReport(report);
    }

    goBack(): void {
        this.router.navigate(['/profile-selection']);
    }
}
