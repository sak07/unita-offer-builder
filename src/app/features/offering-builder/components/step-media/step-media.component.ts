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

  galleryImages: (string | null)[] = [null, null];
  private thumbnailObjectUrl: string | null = null;
  private galleryObjectUrls: (string | null)[] = [null, null];

  colors = [
    { name: 'Red', value: '#A93535', gradient: 'linear-gradient(135deg, #A93535 0%, #8B2D2D 100%)' },
    { name: 'Orange', value: '#C13E26', gradient: 'linear-gradient(135deg, #C13E26 0%, #A0331F 100%)' },
    { name: 'Green', value: '#367E3F', gradient: 'linear-gradient(135deg, #367E3F 0%, #2D6934 100%)' },
    { name: 'Purple', value: '#A1386B', gradient: 'linear-gradient(135deg, #A1386B 0%, #852E58 100%)' },
    { name: 'Grey', value: '#525252', gradient: 'linear-gradient(135deg, #525252 0%, #444444 100%)' }
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
