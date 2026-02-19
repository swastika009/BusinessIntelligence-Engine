function calculateKPIs(data) {

  if (!Array.isArray(data)) return [];

  return data.map(row => {

    const units = Number(row.Units_Sold) || 0;
    const price = Number(row.Price_Per_Unit) || 0;
    const discount = Number(row.Discount) || 0;
    const totalCost = Number(row.Total_Cost) || 0;
    const returnedUnits = Number(row.Returned_Units) || 0;

    const revenue =
      units * price * (1 - discount / 100);

    const realProfit = revenue - totalCost;

    const profitMargin =
      revenue !== 0
        ? (realProfit / revenue) * 100
        : 0;

    const safeReturnedUnits =
      returnedUnits > units ? units : returnedUnits;

    const returnPercentage =
      units !== 0
        ? (safeReturnedUnits / units) * 100
        : 0;

    const discountSensitivity =
      units * price * (discount / 100);

    return {
      ...row,
      Calculated_Revenue: Number(revenue.toFixed(2)),
      Calculated_Real_Profit: Number(realProfit.toFixed(2)),
      Calculated_Profit_Margin: Number(profitMargin.toFixed(2)),
      Return_Percentage: Number(returnPercentage.toFixed(2)),
      Discount_Sensitivity: Number(discountSensitivity.toFixed(2))
    };
  });
}

module.exports = { calculateKPIs };
