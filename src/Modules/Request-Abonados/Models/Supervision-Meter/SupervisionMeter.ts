export interface SupervisionMeter {
    Id: number;
    Location: string;
    NIS : number;
    Justification: string;
    UserId: number;
}

export interface PartialSupervisionMeter extends Partial<SupervisionMeter> {}

