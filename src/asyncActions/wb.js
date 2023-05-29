import axios from "axios";
import {
  setSuppliesList,
  setSupplyOrders_isFetching,
} from "../actions/wbSupply";

// Список поставок и заказов
export const getSupplyList = () => {
  return async (dispatch) => {
    try {
      const response = await axios({
        method: "get",
        url: "http://127.0.0.1:3003/api/wb/supplies/",
      })
      const supplies = response.data
      dispatch(setSuppliesList(supplies));
    } catch (err) {
      console.log(err);
    };
  };
}

// Этикетки и Сорт Лист
export const getOrdersList = (supplies) => {
  return async (dispatch) => {
    dispatch(setSupplyOrders_isFetching(true))
    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:3003/api/wb/supplies/stickers",
        data: {
          "supplies": supplies
        },
        responseType: "blob",
      });

      const data = await response.data;

      const url = URL.createObjectURL(data);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${supplies}.zip`;
      document.body.appendChild(anchor);
      anchor.style.display = "none";
      anchor.click();

      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
    dispatch(setSupplyOrders_isFetching(false))
  };
};

export const uploadUpdateWbFbsSortList = (selectedFile) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:3003/api/wb/fbs/editlist",
        data: formData,
        responseType: "blob",
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const downloadUpdateWbFbsSortList = () => {
  return async (dispatch) => {
    try {
      const response = await axios({
        method: "get",
        url: "http://127.0.0.1:3003/api/wb/fbs/editlist",
        headers: {},
        data: {},
        responseType: "blob",
      });

      const data = await response.data;

      const url = URL.createObjectURL(data);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Сортировка.xlsx";
      document.body.appendChild(anchor);
      anchor.style.display = "none";
      anchor.click();

      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };
};

export const addApiKey = (api) => {
  return async (dispatch) => {
    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:3003/config/api-key",
        headers: {},
        data: { apikey: api },
        responseType: "json",
      });
    } catch (err) {
      console.log(err);
    }
  };
};