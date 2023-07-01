export async function getToken(db) {
  try {
    function getApiKey(db) {
      return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM api_keys WHERE id = 1;`, function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    let token = await getApiKey(db);
    return token[0].api_key;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}
