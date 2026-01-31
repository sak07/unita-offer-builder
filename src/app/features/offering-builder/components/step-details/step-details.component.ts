import { Component, EventEmitter, Output, ChangeDetectionStrategy, inject } from '@angular/core';
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
  @Output() openPreview = new EventEmitter<void>();

  newTagInput = '';

  state = inject(BuilderStateService);

  /** Stable identity for *ngFor so inputs keep focus when features array is updated. */
  trackByIndex(index: number, _item: string): number {
    return index;
  }

  openTagInput() {
    const tag = prompt('Enter a new tag:');
    if (tag && tag.trim()) {
      this.state.addTag(tag.trim());
    }
  }
}
