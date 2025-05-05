const API_BASE_URL = "http://127.0.0.1:8000/join/";

async function fetchData(endpoint = "") {
  const response = await fetch(`${API_BASE_URL}${endpoint}/`);
  return await response.json();
}

async function submitData(endpoint = "", payload = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await response.json();
}

async function updateData(endpoint = "", payload = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await response.json();
}

async function removeData(endpoint = "") {
  const response = await fetch(`${API_BASE_URL}${endpoint}.json`, {
    method: "DELETE",
  });
  return await response.json();
}