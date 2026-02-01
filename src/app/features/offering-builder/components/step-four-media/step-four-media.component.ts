import { Component, EventEmitter, Output, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderStateService } from '../../services/builder-state.service';
import { PreviewCardComponent } from '../preview-card/preview-card.component';

@Component({
  selector: 'app-step-four-media',
  standalone: true,
  imports: [CommonModule, FormsModule, PreviewCardComponent],
  templateUrl: './step-four-media.component.html',
  styleUrls: ['./step-four-media.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepFourMediaComponent implements OnDestroy {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  galleryImages: (string | null)[] = [null, null];
  private thumbnailObjectUrl: string | null = null;
  private galleryObjectUrls: (string | null)[] = [null, null];

  colors = [
    { name: 'Red', value: '#BE3638', gradient: 'linear-gradient(252.72deg, #BE3638 2.07%, #792145 97.8%)' },
    { name: 'Orange', value: '#D7432C', gradient: 'linear-gradient(249.59deg, #D7432C 5.93%, #942E1E 95.11%)' },
    { name: 'Green', value: '#3EA14A', gradient: 'linear-gradient(251.42deg, #3EA14A 0%, #27622D 101.53%)' },
    { name: 'Purple', value: '#BA437D', gradient: 'linear-gradient(251.42deg, #BA437D 0%, #862957 101.53%)' },
    { name: 'Grey', value: '#8B8B8B', gradient: 'linear-gradient(251.42deg, #8B8B8B 0%, #424242 101.53%)' }
  ];

  constructor(public state: BuilderStateService) { }

  onThumbnailFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    if (this.thumbnailObjectUrl) {
      URL.revokeObjectURL(this.thumbnailObjectUrl);
    }
    this.thumbnailObjectUrl = URL.createObjectURL(file);

    // Update state
    this.state.updateOffering({ thumbnail: this.thumbnailObjectUrl });
    input.value = '';
  }

  onGalleryFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    // Handle previous URL cleanup if replacing
    if (this.galleryObjectUrls[index]) {
      URL.revokeObjectURL(this.galleryObjectUrls[index]!);
    }

    const url = URL.createObjectURL(file);
    this.galleryObjectUrls[index] = url;
    this.galleryImages[index] = url;

    // Filter out nulls for state update
    const currentGallery = this.galleryImages.filter(img => img !== null) as string[];
    this.state.updateOffering({ gallery: currentGallery });

    input.value = '';
  }

  setThemeColor(color: string, gradient: string) {
    this.state.updateOffering({ themeColor: color, themeGradient: gradient });
  }

  ngOnDestroy() {
    if (this.thumbnailObjectUrl) {
      URL.revokeObjectURL(this.thumbnailObjectUrl);
    }
    this.galleryObjectUrls.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
  }
}
