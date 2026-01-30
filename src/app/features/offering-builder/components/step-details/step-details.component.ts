import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderStateService } from '../../services/builder-state.service';

@Component({
  selector: 'app-step-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-details.component.html',
  styleUrls: ['./step-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepDetailsComponent {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  newTagInput = '';

  constructor(public state: BuilderStateService) { }

  addTag() {
    if (this.newTagInput.trim()) {
      this.state.addTag(this.newTagInput.trim());
      this.newTagInput = '';
    }
  }
}
