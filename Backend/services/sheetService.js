const axios = require("axios");

/* SCRIPT URL */
const SHEET_API =
  "https://script.google.com/macros/s/AKfycbxMAx92of-vo-DW-D2H71M_FQ3VFL0t3kSapTXZ_tRbEKIWCspMcZyFzcn4WexGqaY6/exec";


async function getSheetData() {
  const res = await axios.get(SHEET_API);
  return res.data;
}


async function addSheetRow(data) {
  const res = await axios.post(
    SHEET_API,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return res.data;
}


module.exports = {
  getSheetData,
  addSheetRow
};