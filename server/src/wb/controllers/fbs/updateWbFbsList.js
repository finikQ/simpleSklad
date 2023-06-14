import * as fs from "fs/promises";
import xlsx from 'xlsx';

export async function updateWbFbsList(req) {
  try {
    if (!req.file) {
      throw new Error("Файл не найден.");
    }
    const file = req.file;
    const workbook = xlsx.read(file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const requiredColumns = ["article", "name", "barcode", "value"];

    if (Object.keys(data[0]).length !== requiredColumns.length ||
      !requiredColumns.every((col) => data[0].hasOwnProperty(col))) {
      const missingColumns = requiredColumns.filter((col) => !data[0].hasOwnProperty(col));
      return `Неверное количество столбцов или отсутствуют требуемые поля: 
        Количество столбцов: ${Object.keys(data[0]).length}, 
        Ожидаемые столбцы: ${requiredColumns.join(", ")}, 
        Не найденные столбцы: ${missingColumns.join(", ")}`;
    }

    // Обновить список сортировки
    await fs.writeFile("./server/dist/wbfbssort.json", JSON.stringify(data));
    console.log("Данные успешно записаны");
  
    return data;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error
  }
}