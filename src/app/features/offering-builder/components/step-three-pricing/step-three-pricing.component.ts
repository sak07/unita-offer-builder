import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect
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

  isShowRecommendations = signal(true);
  showPriceRange = signal(false);
  offeringTypes: OfferingType[] = ["Product", "Service", "Subscription"];

  constructor(public state: BuilderStateService) {
    // If tiers already exist (more than 1 or first one is filled), don't show recommendations
    if (
      this.state.offering().tiers.length > 1 ||
      this.state.offering().tiers[0].name !== "Standard"
    ) {
      this.isShowRecommendations.set(false);
    }

    // Sync showPriceRange with the active tier's isPriceRange property
    effect(() => {
      const tier = this.activeTier;
      if (tier && tier.isPriceRange !== undefined) {
        this.showPriceRange.set(!!tier.isPriceRange);
      }
    }, { allowSignalWrites: true });
  }

  get activeTier() {
    const tiers = this.state.offering().tiers;
    const selected = tiers.find(t => t.isSelected);
    const fallback = tiers[0];

    return selected || fallback;
  }

  get activeTierIndex() {
    const index = this.state.offering().tiers.findIndex(t => t.isSelected);
    return index >= 0 ? index : 0;
  }

  onOfferingTypeChange(type: OfferingType | null): void {
    if (!type) return;

    // If changing from an existing type, reset everything and go to Step 1
    const currentType = this.state.offering().type;
    if (currentType && currentType !== type) {
      this.state.reset();
      this.state.updateOffering({ type, productType: type === "Product" ? null : undefined });
      this.goToStep1.emit();
    }
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

  recommendationStructure = computed(() => {
    const type = this.state.offering().type;
    if (type === 'Product' || type === 'Subscription') {
      return [
        {
          id: "tier-base",
          name: "Base",
          description: "",
          price: 50,
          billingType: "Per Project" as const,
          features: ["Standard Features", "Email Support"],
        },
        {
          id: "tier-advanced",
          name: "Advanced",
          description: "",
          price: 99,
          billingType: "Per Project" as const,
          features: ["All Base Features", "Priority Support", "Advanced Analytics"],
          isPopular: true,
        },
      ];
    }

    // Default for Service
    return [
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
        name: "Ultimate",
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
  });

  useAiStructure() {
    const aiTiers = this.recommendationStructure();
    this.state.updateOffering({ tiers: aiTiers });
    this.isShowRecommendations.set(false);
    // Select the tier at the selected structure index
    const selectedTier = aiTiers[this.selectedStructureIndex()];
    if (selectedTier) {
      this.state.selectTier(selectedTier.id);
    }
  }

  /** Which structure item is selected in the recommendation preview. */
  selectedStructureIndex = signal(1); // Default to middle/second item which is usually popular

  selectStructureItem(index: number) {
    this.selectedStructureIndex.set(index);
  }

  manualCreation() {
    // Start with the recommended structure as a base
    const recTiers = this.recommendationStructure();
    this.state.updateOffering({ tiers: recTiers });

    // Add the new blank tier on top
    this.state.addTier();

    this.isShowRecommendations.set(false);
    // Select the newly added tier (last one)
    const newTierId = this.state.offering().tiers[recTiers.length]?.id;
    if (newTierId) {
      this.state.selectTier(newTierId);
    }
  }

  setActiveTier(index: number) {
    const tier = this.state.offering().tiers[index];
    if (tier) {
      this.state.selectTier(tier.id);
    }
  }

  addNewTier() {
    this.state.addTier();
    // Select the newly added tier (last one)
    setTimeout(() => {
      const tiers = this.state.offering().tiers;
      const newTier = tiers[tiers.length - 1];
      if (newTier) {
        this.state.selectTier(newTier.id);
      }
    });
  }

  deleteActiveTier() {
    const tierId = this.activeTier.id;
    const currentIndex = this.activeTierIndex;
    this.state.removeTier(tierId);

    // If tiers remain, select appropriate tier
    const remainingTiers = this.state.offering().tiers;
    if (remainingTiers.length > 0) {
      // If we deleted the last one, select the new last one. Otherwise select at same index
      const newIndex = currentIndex >= remainingTiers.length ? remainingTiers.length - 1 : currentIndex;
      const tierToSelect = remainingTiers[newIndex];
      if (tierToSelect) {
        this.state.selectTier(tierToSelect.id);
      }
    } else {
      // No tiers left, go back to recommendations
      this.isShowRecommendations.set(true);
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

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}