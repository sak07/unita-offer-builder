import { Component, EventEmitter, Output, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
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
export class StepFourMediaComponent implements OnInit, OnDestroy {
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
  ngOnInit() {
    // Re-initialize local state from builder service for navigation persistence
    const existingGallery = this.state.offering().gallery;
    if (existingGallery && existingGallery.length > 0) {
      this.galleryImages = [
        existingGallery[0] || null,
        existingGallery[1] || null
      ];
      this.galleryObjectUrls = [...this.galleryImages];
    } else {
      this.galleryImages = [null, null];
      this.galleryObjectUrls = [null, null];
    }

    // Preserve thumbnail object URL if it exists in state
    if (this.state.offering().thumbnail) {
      this.thumbnailObjectUrl = this.state.offering().thumbnail || null;
    }

    // Set first color as default if no color is selected
    if (!this.state.offering().themeColor) {
      this.setThemeColor(this.colors[0].value, this.colors[0].gradient);
    }
  }

  onThumbnailFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    // Handle previous URL cleanup if it was a blob URL we created
    if (this.thumbnailObjectUrl && this.thumbnailObjectUrl.startsWith('blob:')) {
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

    // Handle previous URL cleanup if it was a blob URL we created
    if (this.galleryObjectUrls[index] && this.galleryObjectUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(this.galleryObjectUrls[index]!);
    }

    const url = URL.createObjectURL(file);
    this.galleryObjectUrls[index] = url;
    this.galleryImages[index] = url;

    // We store the full array including nulls/placeholders if needed, 
    // but the interface says gallery: string[]
    const currentGallery = this.galleryImages.filter(img => !!img) as string[];
    this.state.updateOffering({ gallery: currentGallery });

    input.value = '';
  }

  setThemeColor(color: string, gradient: string) {
    this.state.updateOffering({ themeColor: color, themeGradient: gradient });
  }

  ngOnDestroy() {
    // Do NOT revoke object URLs here, as they need to persist when navigating back/forth
    // They will be cleaned up if the user replaces them or when the whole app is destroyed
  }
}
