import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getProductListWithDiscount = createAsyncThunk(
    "product/productListWithDiscount",
    async ({ organization_id }: { organization_id: number }) => {
        try {
            const response = await axiosInstance.get(`/products/discount/${organization_id}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch product list with discount:", error);
        }
    }
)

export const getProductDetail = createAsyncThunk(
    "product/productDetail",
    async ({ product_id }: { product_id: number }) => {
        try {
            const response = await axiosInstance.get(`/products/${product_id}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch product detail:", error);
        }
    }
)