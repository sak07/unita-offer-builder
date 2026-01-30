import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderStateService } from '../../services/builder-state.service';
import { OfferingType } from '../../interfaces/offering.interface';

@Component({
  selector: 'app-step-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-selection.component.html',
  styleUrls: ['./step-selection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepSelectionComponent {
  @Output() next = new EventEmitter<void>();
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
