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

    readonly stepTwoComplete = computed(() => {
        const { name, tagline } = this.offeringSignal();
        return !!(name?.trim() && tagline?.trim());
    });

    // Computed Values for Preview Card
    readonly previewTierCount = computed(() => {
        return this.offeringSignal().tiers.length;
    });

    readonly previewFeatures = computed(() => {
        const features = this.offeringSignal().features;
        // Filter out empty features and use up to 3
        const nonEmptyFeatures = features.filter(f => f && f.trim().length > 0);
        if (nonEmptyFeatures.length > 0) {
            return nonEmptyFeatures.slice(0, 3);
        }
        // Fallback features if none exist
        return [
            "No features added"
        ];
    });

    readonly priceDisplay = computed(() => {
        const tiers: PricingTier[] = this.offeringSignal().tiers;
        if (!tiers.length) return { min: 0, max: null, period: null, isQuoteOnly: false, currency: 'NZD' };

        // Use selected tier if available, otherwise popular tier, otherwise first tier
        let displayTier = tiers.find(t => t.isSelected) || tiers.find(t => t.isPopular) || tiers[0];

        return {
            min: displayTier.price,
            // Only show max if price range is explicitly enabled
            max: displayTier.isPriceRange ? displayTier.priceMax : null,
            period: displayTier.pricePeriod || (displayTier.billingType === 'Hourly' ? 'hr' : null),
            isQuoteOnly: displayTier.isQuoteOnly,
            currency: 'NZD'
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
        this.offeringSignal.update((state: Offering) => {
            // If setting a tier as popular, unmark others
            const isSettingPopular = partial.isPopular === true;

            return {
                ...state,
                tiers: state.tiers.map((t: PricingTier) => {
                    if (t.id === tierId) {
                        return { ...t, ...partial };
                    }
                    if (isSettingPopular) {
                        return { ...t, isPopular: false };
                    }
                    return t;
                })
            };
        });
    }

    selectTier(tierId: string) {
        this.offeringSignal.update((state: Offering) => ({
            ...state,
            tiers: state.tiers.map((t: PricingTier) => ({
                ...t,
                isSelected: t.id === tierId
            }))
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
