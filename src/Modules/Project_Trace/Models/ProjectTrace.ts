    import type { Project } from "../../Project/Models/Project";
    import type { ActualExpense } from "../../Actual-Expense/Models/ActualExpense";

    export interface ProjectTrace {
        Id : number;
        Name : string;
        date : string;
        Observation : string;
        IsActive : boolean;
        ActualExpense : ActualExpense;
        Project : Project;
    }

    export interface newProjectTrace {
        Name : string;
        Observation : string; 
        ProjectId : number  
    }