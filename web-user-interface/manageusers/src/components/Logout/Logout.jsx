export default () => {
  const logout= () => {
    sessionStorage.removeItem("loggedUser");
    window.location.reload();
  }

  return (
    <div class="flex flex-col md:flex-row gap-6 justify-center items-start p-6">
      <button onClick={logout} class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow">Logout</button>
    </div>
  );
};
