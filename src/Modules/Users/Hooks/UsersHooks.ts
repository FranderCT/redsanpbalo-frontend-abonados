import { useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";
import type { UsersPaginationParams, User, UpdateUser } from "../Models/User";
import { getUserProfile, updateUserProfile, updateUserEmail, getAllUsers, deleteUser, 
  createUserModal, getAllRoles, updateUser, getUserById, deteleUserById, searchUsers, 
  getUserByRoleAdmin,
  getAllAbonados,
  getUsersByRoleFontanero} from "../Services/UsersServices";

export const useGetUserProfile = () => {
    const {data: UserProfile, isLoading, error} = useQuery({
        queryKey: ['user-profile'],
        queryFn: () => getUserProfile()
    });

    return { UserProfile, isLoading, error };
}

export const useUpdateUserProfile = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Invalidar el perfil del usuario logueado
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      console.log("Usuario Actualizado");
      navigate({ to: "/dashboard/users/profile" });
    },
  });
};

export const useUpdateUserEmail = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUserEmail,
    onSuccess: () => {
      // Invalidar el perfil del usuario logueado
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      console.log("Usuario Actualizado");
      navigate({ to: "/dashboard/users/profile" });
    },
  });
};

export const useGetAllUsers = () => {
  const { data: usersProfiles, isPending, error } = useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
    
  });
  return { usersProfiles, isPending, error };
};

export const useGetAllAbonados = () => {
  const { data: totalAbonados, isPending, error } = useQuery({
    queryKey: ["users", "abonados"],
    queryFn: getAllAbonados,
    
  });
  console.log("Total Abonados:", totalAbonados);
  return { totalAbonados, isPending, error };
};

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
      mutationFn: (id: number) => deleteUser(id),
      onSuccess: (res, id) => {
          // Invalidar todas las consultas de usuarios
          qc.invalidateQueries({ queryKey: ["users"] });
          // Invalidar específicamente el usuario deshabilitado
          qc.invalidateQueries({ queryKey: ["users", "detail", id] });
          console.log("Usuario inhabilitado", res);
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
          // Invalidar todas las consultas de usuarios para refrescar listas
          qc.invalidateQueries({queryKey: ['users']});
          // Invalidar también abonados si el usuario creado es abonado
          qc.invalidateQueries({queryKey: ['users', 'abonados']});
      },
      onError: (err) =>{
          console.log("error al crear", err)
      }
  })
  return mutation;
};



export const useGetAllRoles = () => {
  const {data: roles = [],isLoading,error,} = useQuery({
    queryKey: ["users", "roles"],
    queryFn: getAllRoles,    
  });

  return { roles, isLoading, error };
};


export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
      mutationFn: ({ id, data }: { id: number; data: UpdateUser }) =>
      updateUser(id, data),
      onSuccess: (_, { id }) => {
        // Invalidar todas las consultas de usuarios
        qc.invalidateQueries({ queryKey: ["users"] });
        // Invalidar específicamente el usuario actualizado
        qc.invalidateQueries({ queryKey: ["users", "detail", id] });
        // Invalidar perfil si es el usuario logueado
        qc.invalidateQueries({ queryKey: ["user-profile"] });
      },
  });
};


export const useGetUserById = (id: number) => {

  const {data: user, isLoading,error} = useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => getUserById(id),
  });

  return { user, isLoading, error };
};


export const useDeleteUserByID = () =>{
    const qc = useQueryClient();

    const mutation = useMutation({
      mutationFn: (id: number) => deteleUserById(id),
      onSuccess: (res, id) =>{
        // Invalidar todas las consultas de usuarios
        qc.invalidateQueries({queryKey: ["users"]});
        // Remover específicamente el usuario eliminado del caché
        qc.removeQueries({queryKey: ["users", "detail", id]});
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
      queryKey: ["users", "paginated", params],
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
  const { data: userAdmin = [], isPending, error } = useQuery({
    queryKey: ["users", "by-role", "admin"],
    queryFn: getUserByRoleAdmin,
  });

  return { userAdmin, isPending, error };
};

export const useGetUsersByRoleFontanero = () => {
  const { data: fontaneros = [], isPending, error } = useQuery({
    queryKey: ["users", "by-role", "fontanero"],
    queryFn: getUsersByRoleFontanero,
  });

  return { fontaneros, isPending, error };
};
