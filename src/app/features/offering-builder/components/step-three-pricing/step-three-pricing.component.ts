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
import { OfferingType } from "../../interfaces/offering.interface";

@Component({
  selector: 'app-step-three-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-three-pricing.component.html',
  styleUrls: ['./step-three-pricing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepThreePricingComponent {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() openPreview = new EventEmitter<void>();
  @Output() goToStep1 = new EventEmitter<void>();

  activeTierIndex = signal(0);
  isShowRecommendations = signal(true);
  showPriceRange = signal(false);
  /** Which structure item is selected in the recommendation preview (0=Starter, 1=Professional, 2=Enterprise). */
  selectedStructureIndex = signal(1);

  offeringTypes: OfferingType[] = ["Product", "Service", "Subscription"];

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

  onOfferingTypeChange(type: OfferingType | null): void {
    if (!type) return;
    this.state.updateOffering({ type, productType: type === "Product" ? null : undefined });
    this.goToStep1.emit();
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
    this.activeTierIndex.set(this.selectedStructureIndex());
  }

  selectStructureItem(index: number) {
    this.selectedStructureIndex.set(index);
  }

  manualCreation() {
    if (this.state.offering().tiers.length === 0) {
      this.state.addTier();
    }
    this.isShowRecommendations.set(false);
  }

  setActiveTier(index: number) {
    this.activeTierIndex.set(index);
  }

  deleteActiveTier() {
    const tierId = this.activeTier.id;
    this.state.removeTier(tierId);
    this.activeTierIndex.set(0);
    this.isShowRecommendations.set(true);
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