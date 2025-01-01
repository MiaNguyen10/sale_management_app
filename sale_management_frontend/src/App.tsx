import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage, Login, Profile, Register } from "./pages";
import { path } from "./utils/Constants";
import ProductDetail from "./pages/Product/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={path.login} element={<Login />} />
        <Route path={path.register} element={<Register />} />
        <Route path={path.homepage} element={<HomePage />} />
        <Route path={path.profile} element={<Profile />} />
        <Route path={path.productDetail} element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
