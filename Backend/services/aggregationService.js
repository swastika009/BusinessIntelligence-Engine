function generateDashboardSummary(data) {

  let totalRevenue = 0;
  let totalProfit = 0;
  let totalMargin = 0;
  let totalHealth = 0;

  let riskBreakdown = {
    Healthy: 0,
    Moderate: 0,
    Critical: 0
  };

  data.forEach(row => {

    totalRevenue += Number(row.Calculated_Revenue) || 0;
    totalProfit += Number(row.Calculated_Real_Profit) || 0;
    totalMargin += Number(row.Calculated_Profit_Margin) || 0;
    totalHealth += Number(row.Business_Health_Score) || 0;

    if (riskBreakdown[row.Risk_Level] !== undefined) {
      riskBreakdown[row.Risk_Level]++;
    }
  });

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalProfit: Number(totalProfit.toFixed(2)),
    averageMargin: Number((totalMargin / data.length).toFixed(2)),
    averageHealthScore: Number((totalHealth / data.length).toFixed(2)),
    riskBreakdown
  };
}

module.exports = { generateDashboardSummary };
