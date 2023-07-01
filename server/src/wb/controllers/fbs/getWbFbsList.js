import xlsx from "xlsx";
import { getWbItems } from "../../utils/getWbItems.js";

export async function getWbFbsList(db) {
  try {
    let sortList = await getWbItems(db);
    let workbook = xlsx.utils.book_new();
    let excelSheet = xlsx.utils.json_to_sheet(sortList);
    xlsx.utils.book_append_sheet(workbook, excelSheet, "1");
    const excelData = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    return excelData;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}
