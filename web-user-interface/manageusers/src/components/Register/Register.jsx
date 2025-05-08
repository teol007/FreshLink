import RegisterFarmer from "./RegisterFarmer/RegisterFarmer";
import RegisterRestaurant from "./RegisterRestaurant/RegisterRestaurant";

export default () => {
  return (
    <div class="flex flex-col md:flex-row gap-6 justify-center items-start p-6">
      <div class="flex-1">
        <RegisterFarmer />
      </div>
      <div class="flex-1">
        <RegisterRestaurant />
      </div>
    </div>
  );
};
