import { Component, EventEmitter, Output, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderStateService } from '../../services/builder-state.service';
import { PreviewCardComponent } from '../preview-card/preview-card.component';

@Component({
  selector: 'app-step-media',
  standalone: true,
  imports: [CommonModule, FormsModule, PreviewCardComponent],
  templateUrl: './step-media.component.html',
  styleUrls: ['./step-media.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepMediaComponent implements OnDestroy {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  colors = [
    { name: 'Red', value: '#A93535' },
    { name: 'Orange', value: '#C13E26' },
    { name: 'Green', value: '#367E3F' },
    { name: 'Purple', value: '#A1386B' },
    { name: 'Grey', value: '#525252' }
  ];

  private thumbnailObjectUrl: string | null = null;

  constructor(public state: BuilderStateService) { }

  onThumbnailFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    if (this.thumbnailObjectUrl) {
      URL.revokeObjectURL(this.thumbnailObjectUrl);
      this.thumbnailObjectUrl = null;
    }
    this.thumbnailObjectUrl = URL.createObjectURL(file);
    this.state.updateOffering({ thumbnail: this.thumbnailObjectUrl });
    input.value = '';
  }

  updateThumbnail(url: string) {
    this.state.updateOffering({ thumbnail: url });
  }

  setThemeColor(color: string) {
    this.state.updateOffering({ themeColor: color });
  }

  ngOnDestroy() {
    if (this.thumbnailObjectUrl) {
      URL.revokeObjectURL(this.thumbnailObjectUrl);
    }
  }
}
