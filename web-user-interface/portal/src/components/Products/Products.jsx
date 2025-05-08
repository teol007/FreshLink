import React from "react";

import SolidJsToReactWrapper from "../SolidJsToReactWrapper/SolidJsToReactWrapper";
import placeCreateProduct from "productsoffering/placeCreateProduct";
import placeShowAllProducts from "productsoffering/placeShowAllProducts";

export default function Products() {
  return (
    <>
      <SolidJsToReactWrapper placeSolidJsComponent={placeCreateProduct} />
      <SolidJsToReactWrapper placeSolidJsComponent={placeShowAllProducts} />
    </>
  );
}
