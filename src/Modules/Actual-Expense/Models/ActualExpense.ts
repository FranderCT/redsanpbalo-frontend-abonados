export interface ActualExpense {
    Id: number;
    Observation : string;
    TraceProjectId : number;   
}

export interface NewActualExpense {
    Observation? : string;
    TraceProjectId? : number;   
}