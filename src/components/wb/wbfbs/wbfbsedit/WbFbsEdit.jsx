import React from 'react'
import { Outlet } from "react-router-dom";
import { downloadUpdateWbFbsSortList, uploadUpdateWbFbsSortList } from '../../../../asyncActions/wb';
import { useDispatch } from 'react-redux';
import "./wbfbsedit.less"

const WbFbsEdit = () => {
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    dispatch(uploadUpdateWbFbsSortList(event.target.files[0]))
  };

  function handleDownload() {
    dispatch(downloadUpdateWbFbsSortList())
  }

  return (
    <>
      <div className='sort-block'>
        <div className='text'>Сортировочный Лист</div>
        <div className='sort-buttons'>
            <label className="input-file">
              <input type="file" onChange={handleFileChange} />
              <span className='btn'>Загрузить</span>
            </label>
          <button className='btn' onClick={handleDownload} type="submit">Скачать</button>
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default WbFbsEdit;