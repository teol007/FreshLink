import { createSignal } from "solid-js";
import { createProduct } from "../../modules/products/productsApi";

const defaultForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  unit: "",
  category: ""
};

export default () => {
  const [formData, setFormData] = createSignal(defaultForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData(), [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedData = {
        ...formData(),
        price: parseFloat(formData().price),
        quantity: parseInt(formData().quantity),
      };

      const result = await createProduct(formattedData);
      setFormData(defaultForm);
    } catch (err) {
      alert("Submission error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4 max-w-md mx-auto p-4 border rounded">
      <h2 class="text-xl font-bold">Create Product</h2>

      <input name="name" placeholder="Name" onInput={handleChange} class="w-full p-2 border rounded" value={formData().name} required />
      <input name="description" placeholder="Description" onInput={handleChange} class="w-full p-2 border rounded" value={formData().description} required />
      <input name="price" type="number" step="0.01" placeholder="Price" onInput={handleChange} class="w-full p-2 border rounded" value={formData().price} required />
      <input name="quantity" type="number" placeholder="Quantity" onInput={handleChange} class="w-full p-2 border rounded" value={formData().quantity} required />
      <input name="unit" placeholder="Unit (e.g., kg)" onInput={handleChange} class="w-full p-2 border rounded" value={formData().unit} required />
      <input name="category" placeholder="Category" onInput={handleChange} class="w-full p-2 border rounded" value={formData().category} required />

      <button type="submit" class="w-full bg-green-600 text-white p-2 rounded">Create Product</button>
    </form>
  );
};
