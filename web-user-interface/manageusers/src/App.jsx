import { render } from "solid-js/web";

import "./index.scss";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";

const App = () => (
  <>
    <Register />
    <hr /><Login />
    <hr /><Logout />
  </>
);
render(App, document.getElementById("app"));
