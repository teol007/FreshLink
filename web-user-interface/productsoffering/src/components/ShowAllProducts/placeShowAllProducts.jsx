import { render } from "solid-js/web";
import ShowAllProducts from "./ShowAllProducts";

export default function placeRegister(htmlElement) {
  render(() => <ShowAllProducts />, htmlElement);
}
