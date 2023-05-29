const SET_SUPPLIES_LIST = "SET_SUPPLIES_LIST";
const SET_ORDERS_LIST = "SET_ORDERS_LIST";
const SET_FBS_STICKERS_LIST = "SET_FBS_STICKERS_LIST";
const SET_SUPPLYODERS_IS_FETCHING = "SET_SUPPLYODERS_IS_FETCHING";

export const setSuppliesList = (suppliesList) => ({
  type: SET_SUPPLIES_LIST,
  payload: suppliesList,
});

export const setOrdersList = (ordersList) => ({
  type: SET_ORDERS_LIST,
  payload: ordersList,
});

export const setFbsStickersList = (fbsStickersList) => ({
  type: SET_FBS_STICKERS_LIST,
  payload: fbsStickersList,
});

export const setSupplyOrders_isFetching = (bool) => ({
  type: SET_SUPPLYODERS_IS_FETCHING,
  payload: bool
})
