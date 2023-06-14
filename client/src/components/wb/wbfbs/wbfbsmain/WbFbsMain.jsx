import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersList, getSupplyList } from "../../../../asyncActions/wb";
import "./wbfbsmain.less";

const WbFbsMain = () => {
  const dispatch = useDispatch();

  // Список поставок
  const [supply, setSupply] = useState(0);
  useEffect(() => {
    dispatch(getSupplyList());
  }, []);
  const supplies = useSelector((state) => state.wb.supplies);
  const getSupplyOrders_isFetching = useSelector((state) => state.wb.getSupplyOrders_isFetching);

  // Выбор последней поставки
  const lastSupply = useSelector((state) => state.wb.supplies[state.wb.supplies.length - 1])
  useEffect(() => {
    if (lastSupply) {
      setSupply(lastSupply);
    }
  }, [lastSupply])

  // Dropdown
  const [isActive, setActive] = useState(false)
  const dropdownRef = useRef(null);
  useEffect(() => {
    const pageClickEvent = (e) => {
      // Если клик был выполнен за пределами выпадающего меню, то закрываем меню
      if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
        setActive(!isActive);
      }
    };
    if (isActive) { window.addEventListener('click', pageClickEvent); }
    return () => { window.removeEventListener('click', pageClickEvent); };
  }, [isActive]);

  // Печать заказов
  function printSupplyOrders() {
    dispatch(getOrdersList(supply.supplies_id));
  }

  return (
    <>
      <div className="select-container">
        <div className="dropdown" ref={dropdownRef} onClick={() => setActive(!isActive)}>
          <div className="dropdown-label">{supply.supplies_id} | {supply.supplies_name}</div>
          <div className={`"custom-dropdown ${isActive ? "custom-dropdown-open" : "custom-dropdown-close"}`}>
            {supplies.map((item) => {
              try{
                return (
                  <div className="option" key={item.id} onClick={() => setSupply(item)}>
                    {item.supplies_id} | {item.supplies_name}
                  </div>
                );
              } catch{
                console.error("Произошла ошибка при обработке данных:", error);
                // Возможные действия при возникновении ошибки, например, отображение запасных данных или обработка ошибки
                return (
                  <div>Ошибка</div>
                );
              }
            })
              .reverse()}
          </div>
        </div>
        <div className="download-btn">
          <div className="getSupplyOrders_loader" style={{ display: getSupplyOrders_isFetching ? "block" : "none" }}></div>
          <button disabled={getSupplyOrders_isFetching} className={`button-link ${getSupplyOrders_isFetching ? "button-link-disabled" : ""}`} onClick={printSupplyOrders}>Печать Этикеток</button>
        </div>
      </div>
    </>
  );
};

export default WbFbsMain;
