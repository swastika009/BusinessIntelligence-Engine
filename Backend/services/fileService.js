const XLSX = require("xlsx");
const path = require("path");

const finalPath = path.join(__dirname, "../data/Final.xlsx");

function readFinalData() {
  try {
    const workbook = XLSX.readFile(finalPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      console.log("Excel file is empty");
      return [];
    }

    return data;
  } catch (err) {
    console.error("Excel Read Error:", err);
    return [];
  }
}

module.exports = { readFinalData };
