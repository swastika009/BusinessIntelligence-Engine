// services/aggregationService.js

function generateDashboardSummary(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return {};
  }

  let revenue = 0;
  let profit = 0;
  let margin = 0;
  let health = 0;

  const risk = {
    Healthy: 0,
    Moderate: 0,
    Critical: 0,
  };

  /* MONTHLY TREND */
  const monthly = {};

  data.forEach((r) => {
    const rev = parseFloat(r.Calculated_Revenue) || 0;

    revenue += rev;

    profit += parseFloat(r.Calculated_Real_Profit) || 0;

    margin += parseFloat(r.Calculated_Profit_Margin) || 0;

    health += parseFloat(r.Business_Health_Score) || 0;

    if (risk[r.Risk_Level] !== undefined) {
      risk[r.Risk_Level]++;
    }

    /* Date trend */
    if (r.Date) {
      const d = new Date(r.Date);

      if (!isNaN(d)) {
        const key =
          d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");

        monthly[key] = (monthly[key] || 0) + rev;
      }
    }
  });

  /* Sort months */
  const months = Object.keys(monthly).sort();

  const revenueTrend = months.map((m) => Number(monthly[m].toFixed(2)));

  const revenueLabels = months.map((m) => {
    const [y, mo] = m.split("-");

    return new Date(y, mo - 1).toLocaleString("en", { month: "short" });
  });

  const avgMargin = margin / data.length;
  const avgHealth = health / data.length;

  /* Business Logic */

  let profitability = "Loss Making";

  if (avgMargin > 15) profitability = "Highly Profitable";
  else if (avgMargin > 5) profitability = "Moderately Profitable";

  let riskStatus = "High Risk";

  if (risk.Healthy > risk.Critical) riskStatus = "Low Risk";
  else if (risk.Moderate > risk.Critical) riskStatus = "Medium Risk";

  let actionArea = "Stabilize Operations";

  if (risk.Critical > 0) actionArea = "Seller Audit & Fraud Control";

  if (avgMargin < 5) actionArea = "Cost Optimization";

  let investmentImpact = "Low ROI";

  if (avgMargin > 10 && avgHealth > 60) investmentImpact = "High ROI";
  else if (avgMargin > 5) investmentImpact = "Moderate ROI";

  return {
    totalRevenue: +revenue.toFixed(2),

    totalProfit: +profit.toFixed(2),

    averageMargin: +avgMargin.toFixed(2),

    averageHealthScore: +avgHealth.toFixed(2),

    riskBreakdown: risk,

    revenueTrend,
    revenueLabels,

    profitability,
    riskStatus,
    actionArea,
    investmentImpact,

    logisticsAdvice: "Improve delivery timelines.",

    sellerAdvice: "Review refund-heavy sellers.",

    marketingAdvice: "Scale high ROI campaigns.",
  };
}

module.exports = { generateDashboardSummary };
