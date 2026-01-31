import { Injectable, signal, computed } from '@angular/core';
import { Offering, DEFAULT_OFFERING, PricingTier } from '../interfaces/offering.interface';

@Injectable({
    providedIn: 'root'
})
export class BuilderStateService {
    // Main State Signal
    private offeringSignal = signal<Offering>(DEFAULT_OFFERING);

    // Read-only accessors
    readonly offering = this.offeringSignal.asReadonly();

    // Computed Values for Preview Card
    readonly lowestPrice = computed(() => {
        const tiers: PricingTier[] = this.offeringSignal().tiers;
        if (!tiers.length) return 0;
        return Math.min(...tiers.map((t: PricingTier) => t.price));
    });

    readonly priceDisplay = computed(() => {
        const tiers: PricingTier[] = this.offeringSignal().tiers;
        if (!tiers.length) return { min: 0, max: null, period: null, isQuoteOnly: false };

        const firstTier = tiers[0]; // Logic for simple preview
        return {
            min: firstTier.price,
            max: firstTier.priceMax,
            period: firstTier.pricePeriod || (firstTier.billingType === 'Hourly' ? 'hr' : null),
            isQuoteOnly: firstTier.isQuoteOnly
        };
    });

    private static readonly LIMITS = { name: 85, tagline: 100, description: 350, feature: 50 } as const;

    // State Updates
    updateOffering(partial: Partial<Offering>) {
        const capped: Partial<Offering> = { ...partial };
        if (typeof capped.name === 'string') capped.name = capped.name.slice(0, BuilderStateService.LIMITS.name);
        if (typeof capped.tagline === 'string') capped.tagline = capped.tagline.slice(0, BuilderStateService.LIMITS.tagline);
        if (typeof capped.description === 'string') capped.description = capped.description.slice(0, BuilderStateService.LIMITS.description);
        this.offeringSignal.update((state: Offering) => ({ ...state, ...capped }));
    }

    updateTier(tierId: string, partial: Partial<PricingTier>) {
        this.offeringSignal.update((state: Offering) => ({
            ...state,
            tiers: state.tiers.map((t: PricingTier) => t.id === tierId ? { ...t, ...partial } : t)
        }));
    }

    addTier() {
        this.offeringSignal.update((state: Offering) => ({
            ...state,
            tiers: [
                ...state.tiers,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    name: '',
                    description: '',
                    price: 0,
                    billingType: 'Per Project',
                    features: ['']
                }
            ]
        }));
    }

    updateTierFeature(tierId: string, featureIndex: number, value: string) {
        this.offeringSignal.update((state: Offering) => ({
            ...state,
            tiers: state.tiers.map((t: PricingTier) => {
                if (t.id !== tierId) return t;
                const features = [...t.features];
                features[featureIndex] = value;
                return { ...t, features };
            })
        }));
    }

    addTierFeature(tierId: string) {
        this.offeringSignal.update((state: Offering) => ({
            ...state,
            tiers: state.tiers.map((t: PricingTier) =>
                t.id === tierId ? { ...t, features: [...t.features, ''] } : t
            )
        }));
    }

    removeTierFeature(tierId: string, featureIndex: number) {
        this.offeringSignal.update((state: Offering) => ({
            ...state,
            tiers: state.tiers.map((t: PricingTier) =>
                t.id === tierId ? { ...t, features: t.features.filter((_, i) => i !== featureIndex) } : t
            )
        }));
    }

    removeTier(tierId: string) {
        this.offeringSignal.update((state: Offering) => ({
            ...state,
            tiers: state.tiers.filter((t: PricingTier) => t.id !== tierId)
        }));
    }

    reset() {
        this.offeringSignal.set(DEFAULT_OFFERING);
    }

    // Features Management
    addFeature() {
        this.offeringSignal.update(state => ({
            ...state,
            features: [...state.features, '']
        }));
    }

    updateFeature(index: number, value: string) {
        const capped = value.slice(0, BuilderStateService.LIMITS.feature);
        this.offeringSignal.update(state => {
            const features = [...state.features];
            features[index] = capped;
            return { ...state, features };
        });
    }

    removeFeature(index: number) {
        this.offeringSignal.update(state => ({
            ...state,
            features: state.features.filter((_, i) => i !== index)
        }));
    }

    // Tag Management
    addTag(tag: string) {
        if (!tag.trim()) return;
        this.offeringSignal.update(state => {
            if (state.tags.includes(tag.trim())) return state;
            return { ...state, tags: [...state.tags, tag.trim()] };
        });
    }

    removeTag(tag: string) {
        this.offeringSignal.update(state => ({
            ...state,
            tags: state.tags.filter(t => t !== tag)
        }));
    }
}
