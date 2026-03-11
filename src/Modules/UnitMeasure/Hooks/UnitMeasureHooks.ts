import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUnitMeasure, deleteUnitMeasure, getAllUnitsMeasure, searchUnits, updateUnitMeasure } from "../Services/UnitMeasureServices";
import type { Unit, UnitPaginationParams, UpdateUnitDto } from "../Models/unit";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";


export const useCreateUnitMeasure = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createUnitMeasure,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

export const useUpdateUnitMeasure = () => {
  const qc = useQueryClient();

  return useMutation<Unit, Error, { id: number; data: UpdateUnitDto }>({
    mutationFn: ({ id, data }) => updateUnitMeasure(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

export const useGetAllUnitsMeasure = () => {
  const { data: unit = [], isLoading, error } = useQuery({
    queryKey: ["units"],
    queryFn: getAllUnitsMeasure,
  });

  return { unit, isLoading, error };
};

export const useSearchUnits = (params: UnitPaginationParams) => {
  return useQuery<PaginatedResponse<Unit>, Error>({
    queryKey: ["units", "search", params],
    queryFn: () => searchUnits(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

export const useDeleteUnitMeasure = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUnitMeasure(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["units"] });
    },
  });
};
