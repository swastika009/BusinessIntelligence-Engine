// src/api/api.js

const BASE_URL = "http://localhost:5000";

export async function fetchDashboardSummary() {
  const res = await fetch(`${BASE_URL}/dashboard-summary`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function saveSheetData(data) {
  const res = await fetch(`${BASE_URL}/sheet-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to save data");

  return res.json();
}