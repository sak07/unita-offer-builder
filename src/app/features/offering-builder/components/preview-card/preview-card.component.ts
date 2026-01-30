import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderStateService } from '../../services/builder-state.service';

@Component({
  selector: 'app-preview-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewCardComponent {
  constructor(public state: BuilderStateService) { }
}
