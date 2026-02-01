import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderStateService } from '../../services/builder-state.service';
import { PreviewCardComponent } from '../preview-card/preview-card.component';
import { StepOneSelectionComponent } from '../step-one-selection/step-one-selection.component';
import { StepTwoDetailsComponent } from '../step-two-details/step-two-details.component';
import { StepThreePricingComponent } from '../step-three-pricing/step-three-pricing.component';
import { StepFourMediaComponent } from '../step-four-media/step-four-media.component';

@Component({
    selector: 'app-builder-container',
    standalone: true,
    imports: [
        CommonModule,
        PreviewCardComponent,
        StepOneSelectionComponent,
        StepTwoDetailsComponent,
        StepThreePricingComponent,
        StepFourMediaComponent
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

    handleNextStep() {
        // On Step 2, validate that at least one feature is added
        if (this.currentStep() === 2) {
            const hasFeatures = this.state.offering().features.some(f => f.trim().length > 0);
            if (!hasFeatures) {
                alert('Please add at least one feature before proceeding.');
                return;
            }
        }

        // On Step 3, validate that price is set or quote-only is selected
        if (this.currentStep() === 3) {
            const hasValidPrice = this.state.offering().tiers.some(tier =>
                tier.isQuoteOnly || tier.price > 0
            );

            if (!hasValidPrice) {
                alert('Please add a price or select "Request Quote" for at least one tier before proceeding.');
                return;
            }
        }

        // On Step 4, finish the flow
        if (this.currentStep() === 4) {
            this.finish();
            return;
        }
        this.nextStep();
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
        alert('Offering created successfully!');
        // Reset state and go back to step 1
        this.state.reset();
        this.currentStep.set(1);
    }
}
