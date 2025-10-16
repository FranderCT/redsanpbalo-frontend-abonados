import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupplier, deleteSupplier, getAllSupplier, getSupplierById, searchSuppliers, updateSupplier } from "../Service/SupplierService";
import type { Supplier, SupplierPaginationParams, updatSupplierDto } from "../Models/Supplier";
import { useEffect } from "react";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";

export const useCreateSupplier = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createSupplier,
        onSuccess: (res) =>{
            console.log('proveedor creado correctamente',res)
            qc.invalidateQueries({queryKey: ['suppliers']})
        },
        onError: (err) =>{
            console.error('Error al crear', err)
        }
    })

    return mutation;
}

export const useUpdateSupplier = () =>{
    const qc = useQueryClient();

    const mutation = useMutation<Supplier, Error, {id: number; data: updatSupplierDto }>({
        mutationFn: ({id, data}) => updateSupplier(id, data),
        onSuccess :(res)=>{
            console.log('proveedor actualizado', console.log(res))
            qc.invalidateQueries({queryKey: [`suppliers`]})
        },
        onError: (err) =>{
            console.error(err);
        }
    })

    return mutation;
}

export const useGetAllSupplier = () => {
    const {data: supplier = [], isLoading, error} = useQuery({
        queryKey: ["suppliers"],
        queryFn: getAllSupplier,
    });

    return{supplier, isLoading, error}
}

export const useSearchSuppliers = (params: SupplierPaginationParams) => {
  const query = useQuery<PaginatedResponse<Supplier>, Error>({
    queryKey: ["suppliers", "search", params],
    queryFn: () => searchSuppliers(params),
    placeholderData: keepPreviousData,   // v5
    staleTime: 30_000,
  });

  // ⬇️ Log en cada fetch/refetch exitoso
  useEffect(() => {
    if (query.data) {
      const res = query.data; // res: PaginatedResponse<Category>
      console.log(
        "[Suppliers fetched]",
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
};

export const useDeleteSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["supplier"] });
      console.log("Proveedores inhabilitada", res);
    },
    onError: (err)=>{
      console.error("Error al inhabilitar", err);
    }
  });
};

export const useGetSupplierById = (id?: number) => {
  const { data: supplier, isPending, error } = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { supplier, isPending, error };
}
