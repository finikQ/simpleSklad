export async function getWbItems(db) {
  try {
    function getWbSortList(db) {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT article, name, barcode, sortValue FROM wbitems;`,
          function (err, rows) {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          }
        );
      });
    }

    let sortList = await getWbSortList(db);
    return sortList;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}
