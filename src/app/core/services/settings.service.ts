import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private reduceMotionSubject = new BehaviorSubject<boolean>(this.loadSetting('reduceMotion', false));
  private narrationEnabledSubject = new BehaviorSubject<boolean>(this.loadSetting('narrationEnabled', true));
  private selectedVoiceIndexSubject = new BehaviorSubject<number>(this.loadSetting('selectedVoiceIndex', 0));

  reduceMotion$ = this.reduceMotionSubject.asObservable();
  narrationEnabled$ = this.narrationEnabledSubject.asObservable();
  selectedVoiceIndex$ = this.selectedVoiceIndexSubject.asObservable();

  constructor() {
    // Initial sync of the DOM class
    this.updateMotionClass(this.reduceMotionSubject.value);
  }

  get reduceMotionValue(): boolean {
    return this.reduceMotionSubject.value;
  }

  get narrationEnabledValue(): boolean {
    return this.narrationEnabledSubject.value;
  }

  get selectedVoiceIndexValue(): number {
    return this.selectedVoiceIndexSubject.value;
  }

  setReduceMotion(enabled: boolean): void {
    this.saveSetting('reduceMotion', enabled);
    this.reduceMotionSubject.next(enabled);
    this.updateMotionClass(enabled);
  }

  setNarrationEnabled(enabled: boolean): void {
    this.saveSetting('narrationEnabled', enabled);
    this.narrationEnabledSubject.next(enabled);
  }

  setSelectedVoiceIndex(index: number): void {
    this.saveSetting('selectedVoiceIndex', index);
    this.selectedVoiceIndexSubject.next(index);
  }

  private updateMotionClass(reduce: boolean): void {
    if (typeof document !== 'undefined') {
      if (reduce) {
        document.documentElement.classList.add('reduce-motion');
        document.body.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
        document.body.classList.remove('reduce-motion');
      }
    }
  }

  private loadSetting<T>(key: string, defaultValue: T): T {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(`tinygenius_${key}`);
      if (stored !== null) {
        try {
          return JSON.parse(stored) as T;
        } catch {
          return stored as unknown as T;
        }
      }
    }
    return defaultValue;
  }

  private saveSetting(key: string, value: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`tinygenius_${key}`, JSON.stringify(value));
    }
  }
}
