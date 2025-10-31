export interface Service {
    Id: number;
    Icon: string;
    Title: string;
    Description: string;
    IsActive: boolean;
}

export interface new_Service{
    Icon: string;
    Title: string;
    Description: string;
}

export type update_Service = Partial<new_Service>;