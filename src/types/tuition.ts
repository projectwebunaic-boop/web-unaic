export interface TuitionFee {
    label: string;
    amount: string; // Formatted string like "Rp. 1.500.000"
}

export interface TuitionProgram {
    name: string;
    fees: TuitionFee[];
    note?: string; // Optional note for specific program
}

export interface TuitionCategory {
    name: string; // e.g., "Program Reguler", "Program Profesi"
    programs: TuitionProgram[];
    commonNote?: string; // Note applicable to all programs in this category
}

export interface TuitionFaculty {
    id: string; // Unique ID for tabs
    name: string;
    categories: TuitionCategory[];
}
