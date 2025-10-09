export interface ChangeMeter {
    Id: number;
    Location: string;
    NIS : number;
    Justification: string;
    UserId: number;
}

export interface PartialChangeMeter extends Partial<ChangeMeter> {}