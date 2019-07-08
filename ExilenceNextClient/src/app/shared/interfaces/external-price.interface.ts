export interface ExternalPrice {
    name?: string;
    calculated?: number;
    max?: number;
    mean?: number;
    median?: number;
    min?: number;
    mode?: number;

    // additional properties
    links?: number;
    quality?: number;
    level?: number;
    corrupted?: boolean;
    totalStacksize?: number;
    icon?: string;
}

