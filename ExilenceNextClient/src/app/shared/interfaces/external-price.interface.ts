export interface ExternalPrice {
    name?: string;
    calculated?: number;
    max?: number;
    mean?: number;
    median?: number;
    min?: number;
    mode?: number;
    frameType?: number;
    // additional properties
    variant?: string;
    elder?: boolean;
    shaper?: boolean;
    baseType?: string;
    links?: number;
    quality?: number;
    ilvl?: number;
    level?: number;
    corrupted?: boolean;
    totalStacksize?: number;
    icon?: string;
    tier?: number;
}

