import { Injectable, signal, computed } from '@angular/core';
import { Offering, DEFAULT_OFFERING, PricingTier } from '../interfaces/offering.interface';

@Injectable({
    providedIn: 'root'
})
export class BuilderStore {
    // Main State Signal
    private offeringSignal = signal<Offering>(DEFAULT_OFFERING);

    // Read-only accessors
    readonly offering = this.offeringSignal.asReadonly();

    readonly stepTwoComplete = computed(() => {
        const { name, tagline } = this.offeringSignal();
        return !!(name?.trim() && tagline?.trim());
    });

    private static readonly LIMITS = { name: 85, tagline: 100, description: 350, feature: 50 } as const;

    // Core Updates
    updateOffering(partial: Partial<Offering>) {
        const capped: Partial<Offering> = { ...partial };
        if (typeof capped.name === 'string') capped.name = capped.name.slice(0, BuilderStore.LIMITS.name);
        if (typeof capped.tagline === 'string') capped.tagline = capped.tagline.slice(0, BuilderStore.LIMITS.tagline);
        if (typeof capped.description === 'string') capped.description = capped.description.slice(0, BuilderStore.LIMITS.description);
        this.offeringSignal.update((state: Offering) => ({ ...state, ...capped }));
    }

    patchState(updater: (state: Offering) => Offering) {
        this.offeringSignal.update(updater);
    }

    reset() {
        this.offeringSignal.set(DEFAULT_OFFERING);
    }
}
