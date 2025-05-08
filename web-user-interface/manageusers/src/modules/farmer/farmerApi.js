import { webBffBaseUrl } from '../config';

const farmersBaseUrl = webBffBaseUrl + '/farmers';

export async function registerFarmer(farmerData) {
  const response = await fetch(`${farmersBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(farmerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register farmer');
  }

  return await response.json();
}

export async function loginFarmer(credentials) {
  const response = await fetch(`${farmersBaseUrl}/login`, {
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
