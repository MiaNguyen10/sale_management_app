import Layout from "../../components/Layout";
import OrderSide from "./OrderSide";
import ProductSide from "./ProductSide";

const HomePage = () => {
  return (
    <Layout>
      <div className="p-5 flex">
        {/* Left side: Show products */}
        <ProductSide />
        {/* Right side: Show order */}
        <OrderSide />
      </div>
    </Layout>
  );
};

export default HomePage;
