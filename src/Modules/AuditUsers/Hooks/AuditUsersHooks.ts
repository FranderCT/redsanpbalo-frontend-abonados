import { useQuery } from "@tanstack/react-query";
import { getAllAuditUsers } from "../Services/AuditUsersServices";

export const useGetAllAuditUsers = () => {
  const { data = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["audit-users", "all"],
    queryFn: getAllAuditUsers,
    staleTime: 30_000,
  });

  return { auditUsers: data, isLoading, isError, error, refetch, isFetching };
};
