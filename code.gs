const SHEET_ID_A = '1xiDSCYVA_KZq4OO_LYhoenMZ5KtgJA-LnZIQHTjdJ3w';
const SHEET_ID_B = '1yWQMKrrYc-dcUHnaAMX-4vxrmuUVmSVFnCdY1ZXhqEA';
const SHEET_ID_C = '1pTDkDcg4_0zzUsISan0hIhmf0xQnWPw9jX7mUetj2BU';
const TAB_NAME = "Dados"

const colsMap = {
  A: ["name", "email", "age", "education", "salary", "invested"],
  B: ["name", "email", "age"],
  C: ["name", "education"],
}

/**
 * @param {string} sheetId
 */
function getDataFromSheet(sheetId) {
  const spreadSheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadSheet.getSheetByName(TAB_NAME);

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  const start = [3, 1];
  const end = [lastRow - 2, lastColumn];

  if(end[0] === 0 || end[1] === 0) return null;
  
  const range = sheet.getRange(start[0], start[1], end[0], end[1]);
  const data = range.getValues();

  return data;
}

/**
 * @param {string[][] | null} data
 * @param {'A' | 'B' | 'C'} from;
 * @param {'A' | 'B' | 'C'} to;
 */
function filterData(data, from, to) {
  if(!data || !data?.length || !data[0]?.length) return null;

  const fromCols = colsMap[from];
  const toCols = colsMap[to];

  if(data[0].length !== fromCols.length) {
    throw Error('data must be the same length the colsMap');
  }

  return data.map((item) => {
    return toCols.map((col) => {
      const index = fromCols.indexOf(col);
      if(index === -1) {
        return null;
      }
      return item[index];
    })
  }).filter((item) => item.length);
}

/**
 * @param {string} sheetId
 * @param {{ [key: string]: string }[]} data;
 * @param {'A' | 'B' | 'C'} type
 */
function syncDataIn(sheetId, data, type) {
  const spreadSheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadSheet.getSheetByName(TAB_NAME);

  const lastColumn = colsMap[type].length;
  const lastRow = data.length;

  const start = [3, 1];
  const end = [lastRow, lastColumn];

  sheet.getRange(start[0], start[1], end[0], end[1]).setValues(data);
}

function main() {
  const sourceData = getDataFromSheet(SHEET_ID_A);

  const targets = [
    { from: 'A', to: 'B', sheetId: SHEET_ID_B },
    { from: 'A', to: 'C', sheetId: SHEET_ID_C },
  ]
  
  targets.forEach((target) => {
    const { to, from, sheetId } = target;
    const data = filterData(sourceData, from, to);
    if(data) {
      syncDataIn(sheetId, data, to);
    }
  });
}



