function classifyRisk(score) {

  const s = Number(score);

  if (isNaN(s)) return "Critical";

  if (s >= 75) return "Healthy";
  if (s >= 40) return "Moderate";

  return "Critical";
}


function addRiskCategory(data) {

  if (!Array.isArray(data)) return [];


  return data.map(row => ({

    ...row,

    Risk_Level: classifyRisk(row.Business_Health_Score)

  }));
}

module.exports = { addRiskCategory };
