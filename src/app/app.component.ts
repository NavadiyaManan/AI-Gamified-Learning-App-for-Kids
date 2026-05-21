import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiMascotComponent } from '@shared/components/ai-mascot.component';
import { AmbientBackgroundComponent } from '@shared/components/ambient-background.component';
import { AudioControlComponent } from '@shared/components/audio-control.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AiMascotComponent, AmbientBackgroundComponent, AudioControlComponent],
  template: `
    <main class="min-h-screen overflow-hidden premium-shell">
      <app-ambient-background></app-ambient-background>
      <app-audio-control></app-audio-control>
      <router-outlet></router-outlet>
      <app-ai-mascot></app-ai-mascot>
    </main>
  `,
  styles: []
})
export class AppComponent {
  title = 'TinyGenius - Educational App for Kids';
}
