import { useEffect } from "react";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { selectProductDetail } from "../../store/slices/productSlice";
import { useParams } from "react-router";
import { getProductDetail } from "../../store/hook/product";
import pudding from "../../assets/pudding.jpg";

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
    <div>
      <h1 className="text-3xl font-bold my-5">Product detail</h1>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <img
            src={pudding}
            alt={productDetail.Name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">{productDetail.Name}</h2>
          <p className="text-lg text-gray-500">{productDetail.Description}</p>
          <p className="text-lg font-bold text-red-500">
            {productDetail.Price} EUR
          </p>
          <p className="text-lg text-gray-500">
            Stock quantity: {productDetail.StockQuantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
