const XLSX = require("xlsx");
const path = require("path");

const finalPath = path.join(__dirname, "../data/Final.xlsx");

function readFinalData() {
  const workbook = XLSX.readFile(finalPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

module.exports = { readFinalData };
