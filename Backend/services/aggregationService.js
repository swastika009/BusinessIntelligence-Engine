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

  data.forEach((r) => {
    revenue += Number(r.Calculated_Revenue) || 0;
    profit += Number(r.Calculated_Real_Profit) || 0;
    margin += Number(r.Calculated_Profit_Margin) || 0;
    health += Number(r.Business_Health_Score) || 0;

    if (risk[r.Risk_Level] !== undefined) {
      risk[r.Risk_Level]++;
    }
  });

  const avgMargin = margin / data.length;
  const avgHealth = health / data.length;

  /*  BUSINESS INTELLIGENCE */

  // Profit
  let profitability = "Loss Making";

  if (avgMargin > 15) profitability = "Highly Profitable";
  else if (avgMargin > 5) profitability = "Moderately Profitable";

  // Risk
  let riskStatus = "High Risk";

  if (risk.Healthy > risk.Critical) riskStatus = "Low Risk";
  else if (risk.Moderate > risk.Critical) riskStatus = "Medium Risk";

  // Action
  let actionArea = "Stabilize Operations";

  if (risk.Critical > 0) actionArea = "Seller Audit & Fraud Control";

  if (avgMargin < 5) actionArea = "Cost Optimization";

  // Investment
  let investmentImpact = "Low ROI";

  if (avgMargin > 10 && avgHealth > 60) investmentImpact = "High ROI";
  else if (avgMargin > 5) investmentImpact = "Moderate ROI";

  return {
    // Numbers
    totalRevenue: +revenue.toFixed(2),
    totalProfit: +profit.toFixed(2),
    averageMargin: +avgMargin.toFixed(2),
    averageHealthScore: +avgHealth.toFixed(2),

    riskBreakdown: risk,

    // For Frontend
    profitability,
    riskStatus,
    actionArea,
    investmentImpact,

    expectedGrowth: avgMargin > 10 ? "+10%" : avgMargin > 5 ? "+6%" : "+2%",

    riskReduction: avgHealth > 70 ? "12%" : avgHealth > 50 ? "8%" : "3%",

    // Recommendation Text
    riskTitle: "Critical Risk Alert",
    riskMessage: "Immediate seller audit required.",

    growthTitle: "Growth Opportunity",
    growthMessage: "Marketing spend can be increased.",

    logisticsAdvice: "Improve delivery timelines.",
    sellerAdvice: "Review refund-heavy sellers.",
    marketingAdvice: "Scale high ROI campaigns.",
  };
}

module.exports = { generateDashboardSummary };
