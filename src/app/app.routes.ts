import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'splash',
        pathMatch: 'full'
    },
    {
        path: 'splash',
        loadComponent: () => import('./features/splash/splash.component').then(m => m.SplashComponent)
    },
    {
        path: 'profile-selection',
        loadComponent: () => import('./features/profile-selection/profile-selection.component').then(m => m.ProfileSelectionComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'alphabet',
        loadComponent: () => import('./features/alphabet/alphabet.component').then(m => m.AlphabetComponent)
    },
    {
        path: 'numbers',
        loadComponent: () => import('./features/numbers/numbers.component').then(m => m.NumbersComponent)
    },
    {
        path: 'animals',
        loadComponent: () => import('./features/animals/animals.component').then(m => m.AnimalsComponent)
    },
    {
        path: 'stories',
        loadComponent: () => import('./features/stories/stories.component').then(m => m.StoriesComponent)
    },
    {
        path: 'puzzle',
        loadComponent: () => import('./features/puzzle/puzzle.component').then(m => m.PuzzleComponent)
    },
    {
        path: 'rewards',
        loadComponent: () => import('./features/rewards/rewards.component').then(m => m.RewardsComponent)
    },
    {
        path: 'parent-dashboard',
        loadComponent: () => import('./features/parent-dashboard/parent-dashboard.component').then(m => m.ParentDashboardComponent)
    },
    {
        path: '**',
        redirectTo: 'splash'
    }
];
