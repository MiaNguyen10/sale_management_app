import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import tiramisu from '../../assets/tiramisu.jpg';
import { IconButton } from "@mui/material";

const OrderSide = () => {
  return (
    <div className="w-1/3 pl-5 bg-white p-5 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold my-5">Order</h1>
      <div className="space-y-3">
        <div className="flex flex-row space-x-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={tiramisu} alt="Product" className="w-12 h-12" />
            <p className="text-base">Product Name</p>
          </div>
          <div className="flex flex-col space-y-2 items-center">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-full"
              style={{ background: "#D9DFC6" }}
            >
              <div className="flex justify-center items-center">
                <IconButton>
                  <RemoveIcon />
                </IconButton>
                Quantity
                <IconButton>
                  <AddIcon />
                </IconButton>
              </div>
            </button>
            <p className="text-base font-bold">price</p>
          </div>
        </div>
        <div className="flex flex-row space-x-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={tiramisu} alt="Product" className="w-12 h-12" />
            <p className="text-base">Product Name</p>
          </div>
          <div className="flex flex-col space-y-2 items-center">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-full"
              style={{ background: "#D9DFC6" }}
            >
              <div className="flex justify-center items-center">
                <IconButton>
                  <RemoveIcon />
                </IconButton>
                Quantity
                <IconButton>
                  <AddIcon />
                </IconButton>
              </div>
            </button>
            <p className="text-base font-bold">price</p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3">
          <p className="text-base font-bold">Total price: </p>
          <button style={{ color: "#4B5945", cursor: "pointer" }}>
            <ShoppingCartCheckoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSide;
