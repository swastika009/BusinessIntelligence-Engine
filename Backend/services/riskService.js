function ClassifyRisk(score) {

    const numericScore = Number(score);
    
    if (isNaN(numericScore)) return "Critical";
    if (numericScore >= 75) return "Healthy";
    if (numericScore >= 40)  return "Moderate";
    return "Critical";
}

function addRiskCategory(data) {

    if(!Array.isArray(data)) return [];

    
    return data.map(row =>({
        ...row,
        Risk_Level: ClassifyRisk(row.Business_Health_Score)

    }));
}
module.exports = { addRiskCategory };