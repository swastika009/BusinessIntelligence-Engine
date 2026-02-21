// services/kpiService.js

function calculateKPIs(data) {

  if (!Array.isArray(data)) return [];
  return data.map(row => ({
    ...row,
    Calculated_Revenue:
      parseFloat(row.Revenue) || 0,

    Calculated_Real_Profit:
      parseFloat(row.Real_Profit) || 0,

    Calculated_Profit_Margin:
      parseFloat(row.Profit_Margin) || 0,

    Return_Percentage:
      parseFloat(row.Return_Percentage) || 0,

    Total_Cost:
      parseFloat(row.Total_Cost) || 0

  }));
}

module.exports = { calculateKPIs };