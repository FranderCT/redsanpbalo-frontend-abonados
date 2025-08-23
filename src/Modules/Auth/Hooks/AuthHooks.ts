import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, Login } from "../Services/AuthServices";
import { useNavigate } from "@tanstack/react-router";


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

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      navigate({ to: "/auth/login" }); 
    }
  };
}