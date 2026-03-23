import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showApiErrorToast } from "@/core/api-error";
import {
  getAllReportTypes,
  createReportType,
  updateReportType,
  removeReportType,
} from "../Services/ReportTypeSV";
import type {
  CreateReportTypePayload,
  UpdateReportTypePayload,
} from "../Models/ReportType";

export const useGetAllReportTypes = () => {
  const { data: reportTypes, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["reportTypes"],
    queryFn: getAllReportTypes,
  });
  return { reportTypes, error, isLoading, isError, refetch };
};

export const useCreateReportType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReportTypePayload) => createReportType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportTypes"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useUpdateReportType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: { id: number; payload: UpdateReportTypePayload }) =>
      updateReportType(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportTypes"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};

export const useDeleteReportType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeReportType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportTypes"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};
