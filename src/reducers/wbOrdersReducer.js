const SET_SUPPLIES_LIST = "SET_SUPPLIES_LIST";
const SET_ORDERS_LIST = "SET_ORDERS_LIST";
const SET_FBS_STICKERS_LIST = "SET_FBS_STICKERS_LIST";
const SET_SUPPLYODERS_IS_FETCHING = "SET_SUPPLYODERS_IS_FETCHING";

const defaultState = {
  supplies: [],
  getSupplyOrders_isFetching: false,
  countCheck: 0,
  haha: "",
};

export default function wbOrdersReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_SUPPLIES_LIST:
      return {
        ...state,
        supplies: action.payload,
        getSupplyOrders_isFetching: false
      };

      case SET_ORDERS_LIST:
        return {
          ...state,
        };

      case SET_SUPPLYODERS_IS_FETCHING:
        return {
          ...state,
          getSupplyOrders_isFetching: action.payload
        };

    case SET_FBS_STICKERS_LIST:
      return {
        ...state,
      };
      
    default:
      return state;
  }
}

