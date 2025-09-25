import apiAxios from "../../../api/apiConfig";

import type { NewProductDetail, ProductDetail } from "../Models/ProductDetail";

const BASE = 'productDetail'

export async function createProductDetail (productDetail: NewProductDetail) : Promise <ProductDetail>{
    try{
        const {data} = await apiAxios.post<ProductDetail>(`${BASE}`, productDetail)
        return data
    }catch(err){
        return Promise.reject(err)
    }
}