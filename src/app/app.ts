import { Component } from '@angular/core';
import { BuilderContainerComponent } from './features/offering-builder/components/builder-container/builder-container.component';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BuilderContainerComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App { }
