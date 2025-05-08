import { render } from "solid-js/web";
import CreateProduct from "./CreateProduct";

export default function placeRegister(htmlElement) {
  render(() => <CreateProduct />, htmlElement);
}
