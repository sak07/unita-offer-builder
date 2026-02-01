import { Component } from '@angular/core';
import { BuilderContainerComponent } from './features/offering-builder/components/builder-container/builder-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BuilderContainerComponent],
  template: `
    <app-builder-container></app-builder-container>
  `
})
export class App { }
