import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registerUser } from '../Services/AuthServices';
import type { userPruebaDTO, userPruebaForm } from '../Models/UserPrueba';

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()
    
   const mutation = useMutation<userPruebaDTO, Error, userPruebaForm>({
    mutationFn: registerUser,
    onSuccess: (res) => {
    console.log('Usuario registrado:', res);
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return mutation;
};
