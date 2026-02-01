import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderStateService } from '../../services/builder-state.service';
import { OfferingType } from '../../interfaces/offering.interface';

@Component({
  selector: 'app-step-one-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-one-selection.component.html',
  styleUrls: ['./step-one-selection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepOneSelectionComponent {
  @Output() next = new EventEmitter<void>();
  @Output() openPreview = new EventEmitter<void>();
  types: OfferingType[] = ['Product', 'Service', 'Subscription'];

  constructor(public state: BuilderStateService) { }

  selectType(type: OfferingType) {
    this.state.updateOffering({ type, productType: null });

    // Update existing tiers with sensible defaults for the type
    const billingType = type === 'Subscription' ? 'Monthly Retainer' : 'Per Project';
    const pricePeriod = type === 'Subscription' ? 'Month' : undefined;

    this.state.offering().tiers.forEach(t => {
      this.state.updateTier(t.id, { billingType, pricePeriod });
    });
  }

  selectProductType(productType: 'Physical' | 'Digital') {
    this.state.updateOffering({ productType });
  }
}
