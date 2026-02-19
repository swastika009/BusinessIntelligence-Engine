function calculateKPIs(data) {

  if (!Array.isArray(data) || data.length === 0) return [];


  return data.map(row => {

    const units = Number(row.Units_Sold) || 0;
    const price = Number(row.Price_Per_Unit) || 0;
    const discount = Number(row.Discount) || 0;
    const totalCost = Number(row.Total_Cost) || 0;
    const returned = Number(row.Returned_Units) || 0;


    const revenue = units * price * (1 - discount / 100);

    const profit = revenue - totalCost;

    const margin = revenue !== 0 ? (profit / revenue) * 100 : 0;

    const safeReturned = returned > units ? units : returned;

    const returnPercent = units !== 0 ? (safeReturned / units) * 100 : 0;


    return {

      ...row,

      Calculated_Revenue: +revenue.toFixed(2),
      Calculated_Real_Profit: +profit.toFixed(2),
      Calculated_Profit_Margin: +margin.toFixed(2),
      Return_Percentage: +returnPercent.toFixed(2)

    };
  });
}

module.exports = { calculateKPIs };
