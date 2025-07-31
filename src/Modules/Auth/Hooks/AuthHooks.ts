import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, Login } from "../Services/AuthServices";


export const useCreateUser = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    return mutation;
}

export const useLogin = () => {
    const mutation = useMutation({
        mutationFn: Login,
        onSuccess: (res) =>{
            localStorage.setItem('token', res.token);
            console.log("Login successful, token stored:", res.token);
        }
    })
    return mutation;
}