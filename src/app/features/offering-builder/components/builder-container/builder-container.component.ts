import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderStateService } from '../../services/builder-state.service';
import { PreviewCardComponent } from '../preview-card/preview-card.component';
import { StepSelectionComponent } from '../step-selection/step-selection.component';
import { StepDetailsComponent } from '../step-details/step-details.component';
import { StepPricingComponent } from '../step-pricing/step-pricing.component';
import { StepMediaComponent } from '../step-media/step-media.component';

@Component({
    selector: 'app-builder-container',
    standalone: true,
    imports: [
        CommonModule,
        PreviewCardComponent,
        StepSelectionComponent,
        StepDetailsComponent,
        StepPricingComponent,
        StepMediaComponent
    ],
    templateUrl: './builder-container.component.html',
    styleUrls: ['./builder-container.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderContainerComponent {
    currentStep = signal(1);
    showPreviewDialog = signal(false);

    stepLabels = [
        'Offering Type',
        'Details',
        'Tiers',
        'Images'
    ];

    constructor(public state: BuilderStateService) { }

    /** Step 1 is complete when an offering type is chosen and, if Product, a product sub-type (Physical/Digital) is chosen. */
    step1Complete(): boolean {
        const o = this.state.offering();
        if (!o.type) return false;
        if (o.type === 'Product') return !!o.productType;
        return true;
    }

    nextStep() {
        this.currentStep.update((s: number) => Math.min(s + 1, 4));
    }

    prevStep() {
        this.currentStep.update((s: number) => Math.max(s - 1, 1));
    }

    goToStep(step: number) {
        this.currentStep.set(step);
    }

    togglePreviewDialog() {
        this.showPreviewDialog.update((v: boolean) => !v);
    }

    closePreviewDialog(event?: Event) {
        if (event && event.target !== event.currentTarget) {
            return;
        }
        this.showPreviewDialog.set(false);
    }

    finish() {
        alert('Offering Complete! Check the console for data.');
        console.log('Final Offering Data:', this.state.offering());
    }
}
