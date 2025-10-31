export interface SupervisionMeter {
    Id: number;
    Location: string;
    NIS : number;
    Justification: string;
    UserId: number;
}

export interface TempLinkSupervisionMeterResponse {
    link: string;
    expires: string;
    metadata?: any;
    file: {
    Id: number;
    Path: string;
    RequesChangeNameMeter?: any;
    };
}

export interface PartialSupervisionMeter extends Partial<SupervisionMeter> {}

