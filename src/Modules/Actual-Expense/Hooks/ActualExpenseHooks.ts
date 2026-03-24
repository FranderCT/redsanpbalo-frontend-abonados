import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewActualExpense } from "../Models/ActualExpense";
import { createActualExpense } from "../Services/ActualExpenseServices";
import { toast } from "sonner";
import { projectKeys } from "../../Project/queryKeys";

export const useCreateActualExpense = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: [...projectKeys.all, "actual-expense"],
        mutationFn: (newActualExpense: NewActualExpense) => createActualExpense(newActualExpense),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: projectKeys.all });
            console.log('Actual Expense created:', res);
            toast.success('Gasto real creado con éxito', { position: "top-right", duration: 3000 });
        },
        onError: (error) => {
            console.error('Error creating Actual Expense:', error);
            toast.error('Error al crear el gasto real', { position: "top-right", duration: 3000 });
        }
    })
    return mutation;
}
