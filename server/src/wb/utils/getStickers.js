import axios from "axios";
import { getToken } from "./getToken.js";

export async function getStickers(orders, db) {
  try {
    let api_token = await getToken(db);
    let result = { stickers: [] };
    const requests = [];
    while (orders.length > 0) {
      const chunk = orders.splice(0, 100);

      const request = axios({
        method: "POST",
        url: "https://suppliers-api.wildberries.ru/api/v3/orders/stickers",
        params: {
          type: "png",
          width: "58",
          height: "40",
        },
        headers: {
          Authorization: api_token,
          "Content-Type": "application/json",
        },
        data: {
          orders: chunk,
        },
      });
      requests.push(request);
    }
    const responses = await Promise.all(requests);

    responses.forEach((response) => {
      result.stickers.push(...response.data.stickers);
    });

    console.log("getStickers done");
    return result;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}
