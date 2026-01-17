export interface ReportLocation {
    Id: number;
    Neighborhood: string;
}

export interface CreateReportLocationDTO {
    Neighborhood: string;
}

export const CreateReportLocationDtoDefatultValues: CreateReportLocationDTO = {
    Neighborhood: '',
};

export interface UpdateReportLocationDTO {
    Neighborhood?: string;
}