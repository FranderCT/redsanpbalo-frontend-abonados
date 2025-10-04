export interface ActualExpense {
    Id: number;
    Observation : string;
    TraceProjectionId : number;   
}

export interface NewActualExpense {
    Observation? : string;
    TraceProjectionId? : number;   
}