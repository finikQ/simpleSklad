import xlsx from "xlsx";

export async function updateWbFbsList(req, db) {
  try {
    if (!req.file) {
      throw new Error("Файл не найден.");
    }
    const file = req.file;
    const workbook = xlsx.read(file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    const requiredColumns = ["article", "name", "barcode", "sortValue"];

    if (
      Object.keys(data[0]).length !== requiredColumns.length ||
      !requiredColumns.every((col) => data[0].hasOwnProperty(col))
    ) {
      const missingColumns = requiredColumns.filter(
        (col) => !data[0].hasOwnProperty(col)
      );
      console.log(`Не найденные столбцы: ${missingColumns.join(", ")}`);
      return `Неверное количество столбцов или отсутствуют требуемые поля: 
        Количество столбцов: ${Object.keys(data[0]).length}, 
        Ожидаемые столбцы: ${requiredColumns.join(", ")}, 
        Не найденные столбцы: ${missingColumns.join(", ")}`;
    }

    const sqlUpdateItems = `
      INSERT INTO wbitems (article, name, barcode, sortValue)
      VALUES ${data.map(() => "(?, ?, ?, ?)").join(", ")}
      ON CONFLICT (barcode) DO
        UPDATE SET
          article = excluded.article,
          name = excluded.name,
          sortValue = excluded.sortValue
        WHERE
          wbitems.barcode = excluded.barcode;
    `;

    const values = data.flatMap((item) => [
      item.article,
      item.name,
      item.barcode,
      item.sortValue,
    ]);

    db.run(sqlUpdateItems, values, function (err) {
      if (err) {
        console.error("Ошибка при выполнении SQL-запроса:", err);
      } else {
        console.log("Запрос успешно выполнен");
      }
    });

    return data;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}
