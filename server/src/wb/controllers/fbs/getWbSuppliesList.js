import axios from "axios";
import { getToken } from "../../utils/getToken.js";

export async function getWbSuppliesList(db) {
  try {
    let api_token = await getToken(db);
    async function getSupplies() {
      return new Promise((resolve, reject) => {
        db.all("SELECT * FROM wbfbssupplies", function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
    let firstArray = await getSupplies();

    const getSuppliesList = await axios
      .get("https://suppliers-api.wildberries.ru/api/v3/supplies", {
        headers: {
          Authorization: api_token,
        },
        params: {
          limit: 1000,
          next: 31000000,
        },
      })
      .then(function (response) {
        let supplies = response.data.supplies.slice(-10);
        return supplies;
      })
      .catch(function (error) {
        console.log(error);
      });

    const sqliteSuppliesList = firstArray.map((item) => item.supplies_id);
    const wbFbsSuppliesList = getSuppliesList.map((item) => item.id);

    // Удаление лишних
    const deleteSupplies = sqliteSuppliesList
      .filter((id) => !wbFbsSuppliesList.includes(id))
      .map((id) => `"${id}"`)
      .join(",");

    if (deleteSupplies.length > 0) {
      const sqlDelOrders = `
      DELETE FROM wbfbsorders WHERE supplies_id IN (${deleteSupplies});
      `;
      db.run(sqlDelOrders, function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Удалено ${this.changes} поставок: ${deleteSupplies}`);
        }
      });

      const sqlDelSupplies = `
      DELETE FROM wbfbssupplies WHERE supplies_id IN (${deleteSupplies});
      `;
      db.run(sqlDelSupplies, function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Удалено ${this.changes} заказов: ${deleteSupplies}`);
        }
      });
    }

    // Добавление новых
    const createSupplies = wbFbsSuppliesList.filter(
      (id) => !sqliteSuppliesList.includes(id)
    );
    const createSuppliesSql = createSupplies
      .map(
        (id) =>
          `('${id}', '${getSuppliesList.find((item) => item.id === id).name}')`
      )
      .join(",");

    if (createSupplies.length > 0) {
      const sqlSupplies = `
      INSERT INTO wbfbssupplies (supplies_id, supplies_name) VALUES ${createSuppliesSql};
      `;
      db.run(sqlSupplies, function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Добавлено ${this.changes} поставок: ${createSupplies}`);
        }
      });

      let newSuppliesSql = createSupplies.map(async (supply) => {
        const response = await axios.get(
          `https://suppliers-api.wildberries.ru/api/v3/supplies/${supply}/orders`,
          {
            headers: { Authorization: api_token },
          }
        );
        console.log(response.data.orders.length);
        let result = response.data.orders.map((item) => ({
          supply,
          item_id: item.id,
          item_article: item.article,
          item_barcode: item.skus[0],
        }));
        return result;
      });

      const suppliesOrderLists = await Promise.all(newSuppliesSql);

      const resu = [].concat(...suppliesOrderLists).map((data) => {
        const values = Object.values(data)
          .map((value) => (typeof value === "string" ? `'${value}'` : value))
          .join(", ");
        return `(${values})`;
      });

      const sqlOrders = `
      INSERT INTO wbfbsorders (supplies_id, order_id, item_article, item_barcode) VALUES ${resu};
      `;
      db.run(sqlOrders, function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Добавлено ${this.changes} заказов: ${createSupplies}`);
        }
      });
    }
    let result = await getSupplies();
    return result;
  } catch (error) {
    console.error(error);
  }
}

// TODO: Разбить на отдельные функции
