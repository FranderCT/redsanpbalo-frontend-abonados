import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getAllUsers, getUserProfile, updateUserEmail, updateUserProfile } from "../Services/UsersServices";


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