import { useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";
import type { UsersPaginationParams, User, UpdateUser } from "../Models/User";
import { getUserProfile, updateUserProfile, updateUserEmail, getAllUsers, deleteUser, 
  createUserModal, getAllRoles, updateUser, getUserById, deteleUserById, searchUsers, 
  getUserByRoleAdmin} from "../Services/UsersServices";

export const useGetUserProfile = () => {
    const {data: UserProfile, isLoading, error} = useQuery({
        queryKey: ['users'],
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
      mutationFn: (id: number) => deleteUser(id),
      onSuccess: (res) => {
          qc.invalidateQueries({ queryKey: ["users"] });
          console.log("Usuario inhabilitadp", res);
      },
      onError: (err)=>{
          console.error("Error al inhabilitar", err);
      }
  });

}

export const useCreateUser = () => {
  const qc = useQueryClient();
  const mutation = useMutation({
      mutationFn: createUserModal,
      onSuccess: (res) =>{
          console.log('Usuario creado', res);
          qc.invalidateQueries({queryKey: ['users']})
      },
      onError: (err) =>{
          console.log("error al crear", err)
      }
  })
  return mutation;
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
  return useMutation({
      mutationFn: ({ id, data }: { id: number; data: UpdateUser }) =>
      updateUser(id, data),
      onSuccess: () => {
        // refresca listas donde corresponda
        qc.invalidateQueries({ queryKey: ["users"] });
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

export function useGetAllUsersPaginate(params: UsersPaginationParams) {
  const query = useQuery<PaginatedResponse<User>, Error>({
      queryKey: ["users", "search", params],
      queryFn: () => searchUsers(params),
      placeholderData: keepPreviousData,   // v5
      staleTime: 30_000,
  });
  // ⬇️ Log en cada fetch/refetch exitoso
  useEffect(() => {
      if (query.data) {
      const res = query.data; // res: PaginatedResponse<Category>
      console.log(
          "[Users fetched]",
          {
          page: res.meta.page,
          limit: res.meta.limit,
          total: res.meta.total,
          pageCount: res.meta.pageCount,
          params,
          },
          res.data // array de Category
      );
      }
  }, [query.data, params]);
  return query;
}
export const useGetUsersByRoleAdmin = () => {
  const { data: userAdmin, isPending, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUserByRoleAdmin,
    
  });
  return { userAdmin, isPending, error };
};