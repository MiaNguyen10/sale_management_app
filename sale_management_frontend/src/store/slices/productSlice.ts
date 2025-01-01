import { createSlice } from "@reduxjs/toolkit";
import { getProductDetail, getProductListWithDiscount } from "../hook/product";
import { Product, ProductWithDiscount } from "../type";

interface ProductState {
  productListWithDiscount: ProductWithDiscount[];
  productDetail: Product;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  productListWithDiscount: [],
  productDetail: {
    ProductID: 0,
    Name: "",
    Description: "",
    Price: 0,
    StockQuantity: 0,
  },
  loading: "idle",
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductListWithDiscount.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getProductListWithDiscount.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.productListWithDiscount = action.payload;
      })
      .addCase(getProductListWithDiscount.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(getProductDetail.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.productDetail = action.payload;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? null
      });
  },
});

export default productSlice.reducer;
export const selectProductListWithDiscount = (state: { product: ProductState }) =>
  state.product.productListWithDiscount;
export const selectProductDetail = (state: { product: ProductState }) => state.product.productDetail;
