const BASE_URL = "http://localhost:5000";

export async function fetchDashboardSummary() {
  const res = await fetch(`${BASE_URL}/dashboard-summary`);
  return res.json();
}

export async function fetchKPI() {
  const res = await fetch(`${BASE_URL}/kpi-final`);
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health-score`);
  return res.json();
}
