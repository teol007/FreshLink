import { createSignal } from "solid-js";
import { loginRestaurant } from "../../../modules/restaurant/restaurantApi";

const defaultForm = {
  email: "",
  password: ""
}

export default () => {
  const [formData, setFormData] = createSignal(defaultForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData(), [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginRestaurant(formData());
      console.log("Server response:", result); //!
      console.log("Storage:", sessionStorage.getItem("loggedUser")); //!
      setFormData(defaultForm);
    } catch (err) {
      alert("Submission error: " + err);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4 max-w-md mx-auto p-4 border rounded">
      <h2 class="text-xl font-bold">Login restaurant</h2>

      <input name="email" placeholder="Email" onInput={handleChange} class="w-full p-2 border rounded" value={formData().email} required />
      <input name="password" type="password" placeholder="Password" onInput={handleChange} class="w-full p-2 border rounded" value={formData().password} required />
      
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Login restaurant</button>
    </form>
  );
};
