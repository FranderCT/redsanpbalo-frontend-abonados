import { useQueryClient, useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import { createProduct, deleteProduct, getAllProducts, searchProducts, updateProduct } from "../Services/ProductServices";
import type { Product, ProductPaginationParams, UpdateProduct } from "../Models/CreateProduct";
import type { PaginatedResponse } from "../../Users/Models/Users";
import { useEffect } from "react";

export const useCreateProduct = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: (res) =>{
            console.log('producto creado', res);
            qc.invalidateQueries({queryKey: ['produtcs']})
        },
        onError: (err) =>{
            console.log("error al crear", err)
        }
    })
    return mutation;
}

export const useGetAllProducts = () =>{
    const qc = useQueryClient();
    const { data: products, isPending, error } = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
    });
    return { products, isPending, error };
}


export const useUpdateProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProduct }) =>
        updateProduct(id, data),
        onSuccess: () => {
        // refresca listas donde corresponda
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

export const useDeleteProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: (res) => {
        qc.invalidateQueries({ queryKey: ["categories"] });
        console.log("Categoria inhabilitada", res);
        },
        onError: (err)=>{
        console.error("Error al inhabilitar", err);
        }
    });
};

export const useSearchProducts = (params: ProductPaginationParams) => {
    const query = useQuery<PaginatedResponse<Product>, Error>({
        queryKey: ["categories", "search", params],
        queryFn: () => searchProducts(params),
        placeholderData: keepPreviousData,   // v5
        staleTime: 30_000,
    });

    // ⬇️ Log en cada fetch/refetch exitoso
    useEffect(() => {
        if (query.data) {
        const res = query.data; // res: PaginatedResponse<Category>
        console.log(
            "[Categories fetched]",
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