const express = require("express");
const cors = require("cors");

const { readFinalData } = require("./services/fileService");
const { calculateKPIs } = require("./services/kpiService");
const { addHealthScore } = require("./services/healthScoreService");
const { addRiskCategory } = require("./services/riskService");
const { generateDashboardSummary } = require("./services/aggregationService");


const app = express();   

app.use(cors());
app.use(express.json());


app.get("/kpi-final", (req, res) => {
    const data = readFinalData();
    const kpiData = calculateKPIs(data);

    res.json({
        totalRecords: kpiData.length,
        sampleKPI: kpiData[0]

    });
});


app.get("/inspect-final", (req, res) => {
  const data = readFinalData();

  res.json({
    totalRows: data.length,
    columns: Object.keys(data[0]),
    sampleRow: data[0]
  });
});

app.get("/health-score",(req, res) => {
  const data = readFinalData();
  const kpiData = calculateKPIs(data);
  const healthData = addHealthScore(kpiData);

    res.json({
        totalRecords: healthData.length,
        sampleHealthScore: healthData[0]
    });
});


app.get("/bi-engine", (req, res) => {
    const data = readFinalData();
    const kpiData = calculateKPIs(data);
    const scoredData = addHealthScore(kpiData);
    const riskData = addRiskCategory(scoredData);

    res.json({
        totalRecords: riskData.length,
        sampleRecord: riskData[0]
    });
});

app.get("/dashboard-summary", (req, res) => {

  const rawData = readFinalData();
  const kpiData = calculateKPIs(rawData);
  const scoredData = addHealthScore(kpiData);
  const finalData = addRiskCategory(scoredData);
  const summary = generateDashboardSummary(finalData);

  res.json(summary);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
