import { createSignal, onMount } from "solid-js";
import { getAllProducts } from "../../modules/products/productsApi";
import UpdateProduct from "../UpdateProduct/UpdateProduct";

export default () => {
  const [products, setProducts] = createSignal([]);
  const [editingProduct, setEditingProduct] = createSignal(null);

  onMount(async () => {
    const fetchedProducts = await getAllProducts();
    setProducts(fetchedProducts);
  });

  return (
    <div class="p-4 space-y-4">
      <Show when={!editingProduct()} fallback={
        <>
          <h2 class="text-2xl font-bold">Update product</h2>
          <UpdateProduct product={editingProduct()} />
        </>
        } />
      <br />

      <h2 class="text-2xl font-bold">Products on offer</h2>
      <For each={products()}>
        {product => (
          <div class="border p-4 rounded shadow">
            <h3 class="text-xl font-semibold">{product.name}</h3>
            <p class="text-gray-700">{product.description}</p>
            <p>
              <span class="font-medium">Price:</span> {product.price} € / {product.unit}
            </p>
            <p>
              <span class="font-medium">Quantity:</span> {product.quantity}
            </p>
            <p>
              <span class="font-medium">Category:</span> {product.category}
            </p>
            <p>
              <span class="font-medium">Farmer:</span> {product.farmerName || product.farmer?.name}
            </p>
            <p class="text-sm text-gray-500">
              Location: {product.farmer?.location?.country}
            </p>
            <button
                class="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
                onClick={() => setEditingProduct(product)}
              >Update</button>
          </div>
        )}
      </For>
    </div>
  );
};
