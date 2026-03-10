import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { NewProduct, Product, ProductPaginationParams, UpdateProduct } from "../Models/CreateProduct";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  updateProduct,
} from "../Services/ProductServices";

export const useCreateProduct = () => {
  const qc = useQueryClient();

  return useMutation<Product, Error, NewProduct>({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useGetAllProducts = () => {
  const { data: products = [], isPending, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  return { products, isPending, error };
};

export const useGetProductById = (id: number) => {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: id > 0,
  });

  return { product, isLoading, error };
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();

  return useMutation<Product, Error, { id: number; data: UpdateProduct }>({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useSearchProducts = (params: ProductPaginationParams) => {
  return useQuery<PaginatedResponse<Product>, Error>({
    queryKey: ["products", "search", params],
    queryFn: () => searchProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
