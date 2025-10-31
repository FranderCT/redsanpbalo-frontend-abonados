export interface FAQ {
    Id: number;
    Question: string;
    Answer: string;
    IsActive: boolean;
}

export interface new_FAQ{
    Question: string;
    Answer: string;
}

export type update_FAQ = Partial<new_FAQ>;

export interface FAQPaginationParams {
    page: number;
    limit: number;
    question?: string;
    state?: string;
}
