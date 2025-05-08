import { createSignal } from "solid-js";
import { updateProduct } from "../../modules/products/productsApi";

export default (props) => {
    console.log(props)
    const [productData, setProductData] = createSignal(props.product);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProductData({ ...productData(), [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await updateProduct(productData());
      } catch (err) {
        alert("Error updating product: " + err.message);
      }
    };
  
    return (
      <div class="max-w-md mx-auto p-4">
        <h2 class="text-xl font-bold mb-4">Update Product</h2>
        {productData() ? (
          <form onSubmit={handleSubmit} class="space-y-4">
            <input name="name" class="w-full p-2 border rounded" placeholder="Name" value={productData().name} onInput={handleChange} required />
            <textarea name="description" class="w-full p-2 border rounded" placeholder="Description" value={productData().description} onInput={handleChange} required />
            <input type="number" name="price" step="0.01" class="w-full p-2 border rounded" placeholder="Price" value={productData().price} onInput={handleChange} required />
            <input type="number" name="quantity" class="w-full p-2 border rounded" placeholder="Quantity" value={productData().quantity} onInput={handleChange} required />
            <input name="unit" class="w-full p-2 border rounded" placeholder="Unit (e.g., kg)" value={productData().unit} onInput={handleChange} required />
            <input name="category" class="w-full p-2 border rounded" placeholder="Category" value={productData().category} onInput={handleChange} required />
  
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Update Product</button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };