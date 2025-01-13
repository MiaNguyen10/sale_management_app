import { useEffect } from "react";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { selectProductDetail } from "../../store/slices/productSlice";
import { useParams } from "react-router";
import { getProductDetail } from "../../store/hook/product";
import pudding from "../../assets/pudding.jpg";
import Layout from "../../components/Layout";

const ProductDetail = () => {
  const dispatch = useAppDispatch();
  const productDetail = useSelector(selectProductDetail);
  const { product_id } = useParams();

  useEffect(() => {
    if (product_id) {
      dispatch(getProductDetail({ product_id: Number(product_id) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold my-5">Product detail</h1>
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                {productDetail.DiscountedPrice && (
                  <span className="text-lg line-through text-gray-500">
                    {productDetail.OriginalPrice} EUR
                  </span>
                )}
              </div>

              {/* Stock and Action */}
              <p className="text-lg text-gray-700 mb-6">
                Stock quantity: {productDetail.StockQuantity}
              </p>

              <button className="bg-[#c4d9a1] text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-600 transition">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
