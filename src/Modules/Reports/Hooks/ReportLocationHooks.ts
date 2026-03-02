import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showApiErrorToast } from "@/core/api-error";
import {
  getAllReportLocations,
  createReportLocation,
  updateReportLocation,
  removeReportLocation,
} from "../Services/ReportLocationSV";
import type { CreateReportLocationPayload, UpdateReportLocationPayload } from "../Models/ReportLocation";

export const useGetAllReportLocations = () => {
  const { data: reportLocations, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["reportLocations"],
    queryFn: getAllReportLocations,
  });
  return { reportLocations, error, isLoading, isError, refetch };
};

export const useCreateReportLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReportLocationPayload) =>
      createReportLocation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportLocations"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useUpdateReportLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: { id: number; payload: UpdateReportLocationPayload }) =>
      updateReportLocation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportLocations"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useDeleteReportLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeReportLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportLocations"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

