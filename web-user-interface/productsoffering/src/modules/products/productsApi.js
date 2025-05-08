import { webBffBaseUrl } from '../config';

const productsBaseUrl = webBffBaseUrl + '/products';

function getLoggedUser() {
    const loggedUser = sessionStorage.getItem("loggedUser");
    if(!loggedUser || !JSON.parse(loggedUser).token)
        throw new Error('For this action you have to be logged in');

    return JSON.parse(loggedUser);
}

function isFarmer(loggedUser) {
  if(!loggedUser || !loggedUser.farmer || !loggedUser.farmer._id || !loggedUser.farmer.farmName)
    return false;

  return true;
}

export async function createProduct(productData) {
  const loggedUser = getLoggedUser();

  if(!loggedUser.farmer || !loggedUser.farmer._id || !loggedUser.farmer.farmName)
    throw new Error('Error: only farmers can do this action!');

  productData = {...productData, farmerId: loggedUser.farmer._id, farmerName: loggedUser.farmer.farmName}

  const response = await fetch(`${productsBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': loggedUser.token,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Server returned error ' + response.status);
  }

  window.location.reload();
  return await response.json();
}

export async function getAllProducts() {
  const loggedUser = getLoggedUser();

  const response = await fetch(`${productsBaseUrl}/allInfo`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': loggedUser.token,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Server returned error ' + response.status);
  }

  return await response.json();
}

export async function getProductById(id) {
  const res = await fetch(`${productsBaseUrl}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function updateProduct(productData) {
  const loggedUser = getLoggedUser();

  if(!loggedUser.farmer || !loggedUser.farmer._id || !loggedUser.farmer.farmName)
    throw new Error('Error: only farmers can do this action!');

  productData = {...productData, farmerId: loggedUser.farmer._id, farmerName: loggedUser.farmer.farmName}

  const response = await fetch(`${productsBaseUrl}/${productData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${loggedUser.token}`
    },
    body: JSON.stringify(productData)
  });
  if (!response.ok) throw new Error("Failed to update product");

  window.location.reload();
  return response.json();
}
