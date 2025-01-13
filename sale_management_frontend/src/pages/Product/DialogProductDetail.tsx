import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import pudding from "../../assets/pudding.jpg";
import { getProductDetail } from "../../store/hook/product";
import { selectProductDetail } from "../../store/slices/productSlice";
import { useAppDispatch } from "../../store/store";

interface DialogProductDetailProps {
  open: boolean;
  handleClose: () => void;
  product_id: string;
}

const DialogProductDetail = ({
  open,
  handleClose,
  product_id,
}: DialogProductDetailProps) => {
  const dispatch = useAppDispatch();
  const productDetail = useSelector(selectProductDetail);

  useEffect(() => {
    if (product_id) {
      dispatch(getProductDetail({ product_id: Number(product_id) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-3">
          {/* Product Image Section */}
          <div className="flex justify-center">
            <img
              src={pudding}
              alt={productDetail.ProductName}
              className="w-3/4 max-w-md object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-between">
            {/* Discount and Description */}
            <p className="text-darkGreen text-lg font-bold">
              {productDetail.DiscountName}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {productDetail.DiscountDescription}
            </p>

            {/* Product Name and Description */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {productDetail.ProductName}
            </h1>
            <p className="text-base text-gray-700 mb-6">
              {productDetail.ProductDescription}
            </p>

            {/* Pricing Section */}
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-800 mr-2">
                {productDetail.DiscountedPrice
                  ? `${productDetail.DiscountedPrice} EUR`
                  : `${productDetail.OriginalPrice} EUR`}
              </span>
              {productDetail.DiscountID && (
                <span className="text-lg line-through text-gray-500">
                  {productDetail.OriginalPrice} EUR
                </span>
              )}
            </div>

            {/* Stock and Action */}
            <p className="text-lg text-gray-700 mb-6">
              Stock quantity: {productDetail.StockQuantity}
            </p>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <div className="flex justify-end space-x-4 w-full px-6 py-3">
          <button
            onClick={handleClose}
            className="bg-[#c4d9a1] text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Close
          </button>
          <button className="bg-[#c4d9a1] text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-600 transition">
            Add to cart
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default DialogProductDetail;
