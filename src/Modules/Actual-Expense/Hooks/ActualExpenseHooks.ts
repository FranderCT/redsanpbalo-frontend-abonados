import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewActualExpense } from "../Models/ActualExpense";
import { createActualExpense } from "../Services/ActualExpenseServices";
import { toast } from "react-toastify";

export const useCreateActualExpense = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['actual-expense'],
        mutationFn: (newActualExpense: NewActualExpense) => createActualExpense(newActualExpense),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: ['actual-expense'] });
            console.log('Actual Expense created:', res);
            toast.success('Gasto real creado con éxito', { position: "top-right", autoClose: 3000 });
        },
        onError: (error) => {
            console.error('Error creating Actual Expense:', error);
            toast.error('Error al crear el gasto real', { position: "top-right", autoClose: 3000 });
        }
    })
    return mutation;
}