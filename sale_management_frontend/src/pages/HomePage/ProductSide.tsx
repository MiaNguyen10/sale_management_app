import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EastIcon from "@mui/icons-material/East";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import tiramisu from "../../assets/tiramisu.jpg";
import { getProductListWithDiscount } from "../../store/hook/product";
import { selectProductListWithDiscount } from "../../store/slices/productSlice";
import { useAppDispatch } from "../../store/store";
import { decodeToken } from "../../utils/jwtUtils";

const ProductSide = () => {
  const dispatch = useAppDispatch();
  const productList = useSelector(selectProductListWithDiscount);
  const token = sessionStorage.getItem("token");
  const organization_id = decodeToken(token!)?.organization_id;

  useEffect(() => {
    try {
      if (organization_id) {
        dispatch(
          getProductListWithDiscount({
            organization_id: Number(organization_id),
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch product list with discount:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization_id]);

  // Group products by CategoryName
  const groupedProducts = productList.reduce(
    (groups: { [key: string]: typeof productList }, product) => {
      const category = product.CategoryName;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
      return groups;
    },
    {}
  );

  return (
    <div className="w-2/3 pr-5">
      {Object.keys(groupedProducts).map((category) => (
        <div key={category} className="mb-10">
          <h1 className="text-3xl font-bold my-5">{category}</h1>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5">
            {groupedProducts[category].map((product) => (
              <div
                key={product.ProductID}
                className="bg-white p-5 rounded-lg shadow-lg h-full"
              >
                <div className="flex flex-col h-[400px] space-y-2">
                  {/* Discount Label - Fixed Height */}
                  <div className="h-6">
                    {product.DiscountName && (
                      <p className="font-bold text-base text-red-500">
                        {product.DiscountName}
                      </p>
                    )}
                  </div>
                  {/* Image Container - Fixed Height */}
                  <div className="h-56 w-full mb-3">
                    <img
                      src={tiramisu}
                      alt={product.ProductName}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Product Info - Fixed Height */}
                  <div className="flex-grow">
                    <p className="text-xl mb-2 font-semibold">
                      {product.ProductName}
                    </p>
                    <div className="flex items-center">
                      <span className="text-base font-bold mr-2">
                        {product.DiscountName
                          ? `${product.DiscountedPrice.toFixed(2)} EUR`
                          : `${product.OriginalPrice.toFixed(2)} EUR`}
                      </span>
                      {product.DiscountName && (
                        <span className="text-sm line-through text-gray-500">
                          {product.OriginalPrice.toFixed(2)} EUR
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Button Container - Fixed Position */}
                  <div className="flex justify-between items-center mt-auto">
                    <button className="bg-[#D9DFC6] text-black px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-[#c4d9a1] transition">
                      Show details
                      <EastIcon className="w-4 h-4" />
                    </button>
                    <button className="bg-[#D9DFC6] text-black px-3 py-1 rounded-lg hover:bg-[#c4d9a1] transition">
                      <AddShoppingCartIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSide;
