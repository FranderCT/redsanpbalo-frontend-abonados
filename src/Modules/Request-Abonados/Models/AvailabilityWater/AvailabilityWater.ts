export interface AvailabilityWater {
    Id: number;
    Justification: string;
    UserdId: number;
}

export interface TempLinkResponse {
    link: string;
    expires: string;
    metadata?: any;
    file: {
    Id: number;
    Path: string;
    RequesAvailabilityWater?: any;
    };
}

export interface FolderTempLinksResponse {
    links: string[];
    folderPath: string;
}
export type PartialAvailabilityWater = Partial<AvailabilityWater>;