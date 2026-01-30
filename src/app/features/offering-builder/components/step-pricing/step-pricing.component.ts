import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BuilderStateService } from "../../services/builder-state.service";

@Component({
  selector: 'app-step-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-pricing.component.html',
  styleUrls: ['./step-pricing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepPricingComponent {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  activeTierIndex = signal(0);
  isShowRecommendations = signal(true);
  showPriceRange = signal(false);

  constructor(public state: BuilderStateService) {
    // If tiers already exist (more than 1 or first one is filled), don't show recommendations
    if (
      this.state.offering().tiers.length > 1 ||
      this.state.offering().tiers[0].name !== "Standard"
    ) {
      this.isShowRecommendations.set(false);
    }
  }

  get activeTier() {
    return this.state.offering().tiers[this.activeTierIndex()];
  }

  getOfferingTypeLabel(): string {
    const type = this.state.offering().type;
    switch (type) {
      case "Service":
        return "Service";
      case "Product":
        return "Product";
      case "Subscription":
        return "Subscription";
      default:
        return "Service";
    }
  }

  useAiStructure() {
    const aiTiers = [
      {
        id: "tier-starter",
        name: "Starter",
        description: "",
        price: 550,
        billingType: "Per Project" as const,
        features: ["Basic Support", "Standard Delivery"],
      },
      {
        id: "tier-pro",
        name: "Professional",
        description: "",
        price: 880,
        billingType: "Per Project" as const,
        features: ["Priority Support", "Fast Delivery", "Customization"],
        isPopular: true,
      },
      {
        id: "tier-ent",
        name: "Enterprise",
        description: "",
        price: 1200,
        billingType: "Per Project" as const,
        features: [
          "24/7 Support",
          "Instant Delivery",
          "Unlimited Customization",
        ],
      },
    ];

    this.state.updateOffering({ tiers: aiTiers });
    this.isShowRecommendations.set(false);
    this.activeTierIndex.set(1); // Default to Professional
  }

  manualCreation() {
    this.isShowRecommendations.set(false);
  }

  setActiveTier(index: number) {
    this.activeTierIndex.set(index);
  }

  deleteActiveTier() {
    const tierId = this.activeTier.id;
    this.state.removeTier(tierId);
    this.activeTierIndex.set(0);

    if (this.state.offering().tiers.length === 0) {
      this.state.addTier();
    }
  }

  get yearlyOriginalPrice() {
    return (this.activeTier.price || 0) * 12;
  }

  get yearlyDiscountedPrice() {
    const original = this.yearlyOriginalPrice;
    const discount = this.activeTier.yearlyDiscountPercentage || 0;
    return original * (1 - discount / 100);
  }

  onDiscountToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.state.updateTier(this.activeTier.id, {
      hasYearlyDiscount: checked,
      yearlyDiscountPercentage: checked ? 20 : 0,
    });
  }
}