import { webBffBaseUrl } from '../config';

const restaurantsBaseUrl = webBffBaseUrl + '/restaurants';

export async function registerRestaurant(restaurantData) {
  const response = await fetch(`${restaurantsBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restaurantData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register restaurant');
  }

  return response.json();
}

export async function loginRestaurant(credentials) {
  const response = await fetch(`${restaurantsBaseUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  const loggedFarmer = await response.json();
  sessionStorage.setItem("loggedUser", JSON.stringify(loggedFarmer));
  window.location.reload();
  return loggedFarmer;
}
