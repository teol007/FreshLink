import { createSignal } from "solid-js";
import { registerRestaurant } from "../../../modules/restaurant/restaurantApi";

const defaultForm = {
  email: "",
  password: "",
  name: "",
  description: "",
  location: {
    place: "",
    postCode: "",
    country: "",
  },
  phoneNumber: "",
  rating: "",
};

export default () => {
  const [formData, setFormData] = createSignal(defaultForm);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData().location) {
      setFormData({
        ...formData(),
        location: {
          ...formData().location,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData(), [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData(),
      rating: parseFloat(formData().rating),
    };

    try {
      const result = await registerRestaurant(payload);
      setFormData(defaultForm);
    } catch (err) {
      alert("Submission error: " + err);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4 max-w-md mx-auto p-4 border rounded">
      <h2 class="text-xl font-bold">Register restaurant</h2>

      <input name="email" placeholder="Email" onInput={handleChange} class="w-full p-2 border rounded" value={formData().email} required />
      <input name="password" type="password" placeholder="Password" onInput={handleChange} class="w-full p-2 border rounded" value={formData().password} required />
      <input name="name" placeholder="Restaurant Name" onInput={handleChange} class="w-full p-2 border rounded" value={formData().name} required />
      <input name="description" placeholder="Description" onInput={handleChange} class="w-full p-2 border rounded" value={formData().description} required />
      <input name="phoneNumber" placeholder="Phone Number" onInput={handleChange} class="w-full p-2 border rounded" value={formData().phoneNumber} required />
      <input name="rating" type="number" min={0} max={5} step="0.1" placeholder="Rating" onInput={handleChange} class="w-full p-2 border rounded" value={formData().rating} required />

      <h3 class="font-semibold">Location</h3>
      <input name="place" placeholder="Place" onInput={handleChange} class="w-full p-2 border rounded" value={formData().location.place} required />
      <input name="postCode" placeholder="Post Code" onInput={handleChange} class="w-full p-2 border rounded" value={formData().location.postCode} required />
      <input name="country" placeholder="Country" onInput={handleChange} class="w-full p-2 border rounded" value={formData().location.country} required />

      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Register restaurant</button>
    </form>
  );
};
