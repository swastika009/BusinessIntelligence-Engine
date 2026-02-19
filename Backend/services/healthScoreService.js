function calculateHealthScore(row) {
  let score = 0;

  // Margin (40)
  const margin = Number(row.Calculated_Profit_Margin) || 0;

  if (margin > 20) score += 40;
  else if (margin > 10) score += 30;
  else if (margin > 0) score += 15;

  // Return % (25)
  const returns = Number(row.Return_Percentage) || 100;

  if (returns < 5) score += 25;
  else if (returns < 15) score += 15;
  else if (returns < 30) score += 5;

  // Discount (20)
  const discount = Number(row.Discount) || 0;

  if (discount < 5) score += 20;
  else if (discount <= 15) score += 10;

  // Cost (15)
  if (Number(row.Calculated_Revenue) > Number(row.Total_Cost)) score += 15;
  else score += 5;

  return score;
}

function addHealthScore(data) {
  if (!Array.isArray(data)) return [];

  return data.map((row) => ({
    ...row,

    Business_Health_Score: calculateHealthScore(row),
  }));
}

module.exports = { addHealthScore };
