import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SoundCue = 'tap' | 'success' | 'reward' | 'fail' | 'swipe' | 'levelUp';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private volumeSubject = new BehaviorSubject<number>(0.55);
  private mutedSubject = new BehaviorSubject<boolean>(false);

  volume$ = this.volumeSubject.asObservable();
  muted$ = this.mutedSubject.asObservable();

  setVolume(volume: number): void {
    this.volumeSubject.next(Math.max(0, Math.min(1, volume)));
  }

  toggleMute(): void {
    this.mutedSubject.next(!this.mutedSubject.value);
  }

  play(cue: SoundCue): void {
    if (this.mutedSubject.value) return;

    // Howler can be dropped into this service later without changing callers.
    const context = this.getAudioContext();
    if (!context) return;

    const patterns: Record<SoundCue, number[]> = {
      tap: [420],
      success: [523, 659, 784],
      reward: [659, 784, 988, 1175],
      fail: [220, 196],
      swipe: [330, 440],
      levelUp: [523, 659, 784, 1046],
    };

    patterns[cue].forEach((frequency, index) => {
      this.playTone(context, frequency, index * 0.08, cue === 'fail' ? 0.12 : 0.1);
    });
  }

  private getAudioContext(): AudioContext | null {
    if (this.audioContext) return this.audioContext;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    this.audioContext = new AudioContextClass();
    return this.audioContext;
  }

  private playTone(context: AudioContext, frequency: number, delay: number, duration: number): void {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + delay;
    const end = start + duration;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(this.volumeSubject.value * 0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }
}
