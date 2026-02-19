function calculateHealthScore(row) {

  let score = 0;

  // Profit Margin Score (40)
  const margin = row.Calculated_Profit_Margin;

  if (margin > 20) score += 40;
  else if (margin > 10) score += 30;
  else if (margin > 0) score += 15;
  else score += 0;

  // Return % Score (25)
  const returns = row.Return_Percentage;

  if (returns < 5) score += 25;
  else if (returns < 15) score += 15;
  else if (returns < 30) score += 5;
  else score += 0;

  // Discount Score (20)
  const discount = row.Discount;

  if (discount < 5) score += 20;
  else if (discount <= 15) score += 10;
  else score += 0;

  // Cost Efficiency (15)
  if (row.Calculated_Revenue > row.Total_Cost)
    score += 15;
  else
    score += 5;

  return score;
}

function addHealthScore(data) {
  return data.map(row => {
    const healthScore = calculateHealthScore(row);

    return {
      ...row,
      Business_Health_Score: healthScore
    };
  });
}

module.exports = { addHealthScore };
