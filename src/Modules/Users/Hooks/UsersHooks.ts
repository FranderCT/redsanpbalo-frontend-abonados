import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserModal, deleteUser, deteleUserById, getAllRoles, getAllUsers, getUserById, getUserProfile, updateUser, updateUserEmail, updateUserProfile } from "../Services/UsersServices";
import type { Users, UserUpdate } from "../Models/Users";



export const useGetUserProfile = () => {
    const {data: UserProfile, isLoading, error} = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => getUserProfile()
    });

    return { UserProfile, isLoading, error };
}

export const useUpdateUserProfile = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      console.log("Usuario Actualizado");
      navigate({ to: "/dashboard/users/profile" });
    },
  });
};

export const useUpdateUserEmail = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateUserEmail,
    onSuccess: () => {
      console.log("Usuario Actualizado");
      navigate({ to: "/dashboard/users/profile" });
    },
  });
};

export const useGetAllUsers = () => {
  
  const { data: usersProfiles, isPending, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    
  });
  return { usersProfiles, isPending, error };
};

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
      onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUserModal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () =>{
      console.error("error al crear un usuario");
    }
  });
};



export const useGetAllRoles = () => {
  const {data: roles = [],isLoading,error,} = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,    
  });

  return { roles, isLoading, error };
};


export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation<Users, Error, { id: number; data: UserUpdate }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      // refresca la tabla
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      console.error("Error al actualizar el usuario:", err);
    },
  });
};


export const useGetUserById = (id: number) => {

  const {data: user, isLoading,error} = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
  });

  return { user, isLoading, error };
};


export const useDeleteUserByID = () =>{
    const qc = useQueryClient();

    const mutation = useMutation({
      mutationFn: (id: number) => deteleUserById(id),
      onSuccess: (res) =>{
        qc.invalidateQueries({queryKey: ["users"]})
        console.log("Usuario eliminado, ", res);
      },
      onError: (err)=>{
        console.error("No se pudo eliminar el usuario", err);
      }
    })
    return mutation;
}