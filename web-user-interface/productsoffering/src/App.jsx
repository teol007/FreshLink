import { render } from "solid-js/web";

import "./index.scss";
import CreateProduct from "./components/CreateProduct/CreateProduct";
import ShowAllProducts from "./components/ShowAllProducts/ShowAllProducts";

const App = () => (
  <>
    <CreateProduct />
    <hr /><ShowAllProducts />
  </>
);
render(App, document.getElementById("app"));
