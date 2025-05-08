import { render } from "solid-js/web";
import Login from "./Login"

export default function placeRegister(htmlElement) {
  render(() => <Login />, htmlElement);
}
