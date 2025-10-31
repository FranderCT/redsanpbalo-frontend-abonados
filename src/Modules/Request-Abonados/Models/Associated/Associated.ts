export interface Associated { 
    Id: number;
    IDcard: string;
    Name: string;
    Justification: string;
    Surname1: string;
    Surname2: string;
    NIS: number;
}

export interface TempLinkAssociatedResponse {
    link: string;
    expires: string;
    metadata?: any;
    file: {
    Id: number;
    Path: string;
    RequesChangeNameMeter?: any;
    };
}
export type PartialAssociated = Partial<Associated>;