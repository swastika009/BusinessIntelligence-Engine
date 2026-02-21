const express = require("express");
const cors = require("cors");

const { calculateKPIs } = require("./services/kpiService");
const { addHealthScore } = require("./services/healthScoreService");
const { addRiskCategory } = require("./services/riskService");
const { generateDashboardSummary } = require("./services/aggregationService");

const { getSheetData, addSheetRow } = require("./services/sheetService");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/sheet-data", async (req, res) => {
  try {
    const data = await getSheetData();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Sheet fetch failed",
    });
  }
});


app.post("/sheet-data", async (req, res) => {
  try {
    const result = await addSheetRow(req.body);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Sheet save failed",
    });
  }
});


app.get("/dashboard-summary", async (req, res) => {
  try {
    const rawData = await getSheetData();

    const kpiData = calculateKPIs(rawData);

    const scoredData = addHealthScore(kpiData);

    const finalData = addRiskCategory(scoredData);

    const summary = generateDashboardSummary(finalData);

    res.json(summary);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Summary failed",
    });
  }
});

app.get("/inspect-sheet", async (req, res) => {
  const data = await getSheetData();

  res.json({
    rows: data.length,
    sample: data[0],
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
