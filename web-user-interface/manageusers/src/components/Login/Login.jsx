import LoginFarmer from "./LoginFarmer/LoginFarmer";
import LoginRestaurant from "./LoginRestaurant/LoginRestaurant";

export default () => {
  return (
    <div class="flex flex-col md:flex-row gap-6 justify-center items-start p-6">
      <div class="flex-1">
        <LoginFarmer />
      </div>
      <div class="flex-1">
        <LoginRestaurant />
      </div>
    </div>
  );
};
