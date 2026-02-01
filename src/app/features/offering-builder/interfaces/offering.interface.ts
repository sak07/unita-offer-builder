export type OfferingType = 'Product' | 'Service' | 'Subscription';

export type ProductType = 'Physical' | 'Digital';

export type PricingMethod =
    | 'Fixed Price'
    | 'Per Project'
    | 'Recurring'
    | 'Hourly'
    | 'Monthly';

export type BillingType = 'Per Project' | 'Hourly' | 'Monthly Retainer';

export interface PricingTier {
    id: string;
    name: string;
    displayNameOverwrite?: string;
    description: string;
    price: number;
    priceMax?: number;
    isPriceRange?: boolean;
    pricePeriod?: string;
    billingType: BillingType;
    features: string[];
    isPopular?: boolean;
    isQuoteOnly?: boolean;
    supersedesTierId?: string;
    hasYearlyDiscount?: boolean;
    yearlyDiscountPercentage?: number;
    isSelected?: boolean;
}

export interface Offering {
    type: OfferingType | null;
    productType?: ProductType | null;
    name: string;
    tagline: string;
    description: string;
    features: string[];
    tags: string[];
    tiers: PricingTier[];
    thumbnail?: string;
    gallery: string[];
    themeColor?: string;
    themeGradient?: string;
}

export const DEFAULT_OFFERING: Offering = {
    type: null,
    name: '',
    tagline: '',
    description: '',
    features: [''],
    tags: [],
    tiers: [
        {
            id: '1',
            name: 'Standard',
            description: '',
            price: 0,
            billingType: 'Per Project',
            features: [''],
            isSelected: true
        }
    ],
    gallery: [],
    themeColor: '#b91c1c'
};
