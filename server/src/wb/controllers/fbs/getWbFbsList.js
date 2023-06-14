import * as fs from "fs/promises";
import xlsx from 'xlsx';
import path from "path";

export async function getWbFbsList() {
    try {
        // Чтение данных из файла
        let data = await fs.readFile("./server/dist/wbfbssort.json");
        let excelOrders = JSON.parse(data);

        // Создание файла Excel
        let workbook = xlsx.utils.book_new()
        let excelSheet = xlsx.utils.json_to_sheet(excelOrders)
        xlsx.utils.book_append_sheet(workbook, excelSheet, "1")
        xlsx.writeFileSync(workbook, "./dist/wbfbssort.xlsx")
        const filePath = path.join(path.resolve(), '/dist/wbfbssort.xlsx');
        return filePath
    } catch (error) {
        console.error("Произошла ошибка: ", error);
        throw error
    }
}