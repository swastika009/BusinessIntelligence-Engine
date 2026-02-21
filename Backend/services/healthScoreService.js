// services/healthScoreService.js

function calculateHealthScore(row) {
  let score = 0;
  const margin =
    parseFloat(row.Calculated_Profit_Margin) || 0;

  if (margin > 20) score += 40;
  else if (margin > 10) score += 30;
  else if (margin > 0) score += 15;


  const returns =
    parseFloat(row.Return_Percentage) || 100;

  if (returns < 5) score += 25;
  else if (returns < 15) score += 15;
  else if (returns < 30) score += 5;


  const discount =
    parseFloat(row.Discount) || 0;

  if (discount < 5) score += 20;
  else if (discount <= 15) score += 10;


  const revenue =
    parseFloat(row.Calculated_Revenue) || 0;

  const cost =
    parseFloat(row.Total_Cost) || 0;

  if (revenue > cost) score += 15;
  else score += 5;


  return score;
}


function addHealthScore(data) {

  if (!Array.isArray(data)) return [];

  return data.map(row => ({

    ...row,

    Business_Health_Score:
      calculateHealthScore(row)

  }));
}

module.exports = { addHealthScore };