import { jsPDF } from "jspdf";
import AdmZip from "adm-zip";
import xlsx from "xlsx";
import { getWbItems } from "../../utils/getWbItems.js";
import { getStickers } from "../../utils/getStickers.js";

async function generateStickersArray(req, db) {
  try {
    function getSupplies() {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM wbfbsorders WHERE supplies_id='${req.supplies}';`,
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
    let supplies = await getSupplies();
    let orderIdList = supplies.map((item) => item.order_id);

    let arr_stickersList = await getStickers(orderIdList, db); // Получение списка наклеек для каждого заказа
    arr_stickersList.stickers.sort((a, b) => a.orderId - b.orderId);

    let sql = `UPDATE wbfbsorders SET 
      sticker = CASE `;
    arr_stickersList.stickers.forEach((order) => {
      const { orderId, file } = order;
      sql += `WHEN order_id = ${orderId} THEN '${file}' `;
    });
    sql += `END, 
      sticker_partA = CASE `;
    arr_stickersList.stickers.forEach((order) => {
      const { orderId, partA } = order;
      sql += `WHEN order_id = ${orderId} THEN '${partA}' `;
    });
    sql += `END,
      sticker_partB = CASE `;
    arr_stickersList.stickers.forEach((order) => {
      const { orderId, partB } = order;
      sql += `WHEN order_id = ${orderId} THEN '${partB}' `;
    });
    sql += `END,
      sticker_barcode = CASE `;
    arr_stickersList.stickers.forEach((order) => {
      const { orderId, barcode } = order;
      sql += `WHEN order_id = ${orderId} THEN '${barcode}' `;
    });
    sql += `END
      WHERE order_id IN (${arr_stickersList.stickers
        .map((order) => order.orderId)
        .join(",")})`;

    db.run(sql, function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Обновлено ${this.changes} строк`);
      }
    });
    return { arr_stickersList };
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}

async function sortOrders(req, db) {
  try {
    function getSupplies() {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM wbfbsorders WHERE supplies_id='${req.supplies}';`,
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
    let arr_OrdersInfo = await getSupplies();
    /*     let arr_itemsInfo = JSON.parse(
      await fs.readFile("./server/dist/wbfbssort.json")
    ); */
    let arr_itemsInfo = await getWbItems(db);
    let sortedOrders = arr_OrdersInfo
      .map((order) => {
        let matchInfo = arr_itemsInfo.find((item) => {
          return Number(item.barcode) == Number(order.item_barcode);
        });
        if (matchInfo) {
          return {
            article: matchInfo.article,
            name: matchInfo.name,
            barcode: order.item_barcode,
            id: order.id,
            file: order.sticker,
            value: matchInfo.sortValue,
            partA: order.sticker_partA,
            partB: order.sticker_partB,
          };
        } else {
          return {
            article: order.item_article,
            name: 'Необходимо обновить "Сортировочный Лист", добавить этот товар',
            barcode: order.item_barcode,
            id: order.id,
            file: order.sticker,
            value:
              'Необходимо обновить "Сортировочный Лист", добавить этот товар',
            partA: order.sticker_partA,
            partB: order.sticker_partB,
          };
        }
      })
      .sort((a, b) => a.partB - b.partB)
      .sort((a, b) => (a.value || 0) - (b.value || 0));
    return sortedOrders;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}

async function createExcelFile(sortedOrders) {
  try {
    let excelOrders = sortedOrders.map((item) => {
      let partB = item.partB.toString();
      if (partB.length < 4) {
        partB = "0".repeat(4 - partB.length) + partB;
      }
      return {
        Артикул: item.article,
        Название: item.name,
        С1: item.partA,
        С2: partB,
      };
    });
    let workbook = xlsx.utils.book_new();
    let excelSheet = xlsx.utils.json_to_sheet(excelOrders);
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

async function createPdfDocument(sortedOrders) {
  try {
    const pdf = new jsPDF("l", "mm", [58, 40]);
    for (const item of sortedOrders) {
      pdf.addPage();
      pdf.addImage(item.file, "PNG", 0, 0, 58, 40);
    }
    pdf.deletePage(1);
    const pdfData = pdf.output();
    const bufferData = Buffer.from(pdfData, "binary");
    return bufferData;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}

export async function getWbOrdersList(req, db) {
  try {
    console.log("Получение списка и Сортировка Этикеток");
    await generateStickersArray(req, db);
    const sortedOrders = await sortOrders(req, db);
    console.log("Формирование Excel и PDF файлов");

    const [pdfData, excelData] = await Promise.all([
      createPdfDocument(sortedOrders),
      createExcelFile(sortedOrders),
    ]);
    const zip = new AdmZip();
    zip.addFile(`${req.supplies}_Этикетки.pdf`, pdfData);
    zip.addFile(`${req.supplies}_СборочныйЛист.xlsx`, excelData);
    const zipData = zip.toBuffer();
    return zipData;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}
