import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type MascotMood = 'ready' | 'happy' | 'celebrate' | 'thinking' | 'retry' | 'sleepy';

export interface MascotState {
  mood: MascotMood;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MascotService {
  private readonly defaultState: MascotState = {
    mood: 'ready',
    message: 'Ready for a new adventure?',
  };

  private mascotSubject = new BehaviorSubject<MascotState>(this.defaultState);
  mascot$ = this.mascotSubject.asObservable();

  encourage(message = 'You are getting better every time!'): void {
    this.setMood('happy', message);
  }

  celebrate(message = 'Amazing job! You unlocked a star!'): void {
    this.setMood('celebrate', message);
  }

  retry(message = 'That was close! One more try!'): void {
    this.setMood('retry', message);
  }

  think(message = 'Let us choose a smart next step.'): void {
    this.setMood('thinking', message);
  }

  private setMood(mood: MascotMood, message: string): void {
    this.mascotSubject.next({ mood, message });
    window.setTimeout(() => this.mascotSubject.next(this.defaultState), 4200);
  }
}
