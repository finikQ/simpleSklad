import {combineReducers} from "redux";
import {createStore, applyMiddleware} from "redux";
import wbOrdersReducer from "./wbOrdersReducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk"


const rootReducer = combineReducers ({ 
    wb: wbOrdersReducer
})



export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))