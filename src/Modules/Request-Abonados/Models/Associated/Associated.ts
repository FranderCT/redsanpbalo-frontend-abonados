export interface Associated { 
    Id: number;
    IDcard: string;
    Name: string;
    Justification: string;
    Surname1: string;
    Surname2: string;
    NIS: number;
}

export type PartialAssociated = Partial<Associated>;