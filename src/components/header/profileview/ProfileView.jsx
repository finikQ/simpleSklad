import React, { useState } from "react";
import "./profileview.less"
import { useDispatch } from 'react-redux';
import { addApiKey } from "../../../asyncActions/wb";

const ProfileView = () => {
  const dispatch = useDispatch();
  const [apiKey, setApiKey] = useState('');

  const handleChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addApiKey(apiKey))
    setApiKey('')
  };

  return (
    <div>
      <span className="header_profile">Профиль</span>
      <div className="header_profile_dropdown">
        <div className="ProfileDropdown">
          <div className="DropdownHeader">
            <span>Профиль</span>
            <span>Настройки</span>
          </div>
          <div className="ProfileDropdown_content">
            <div className="ProfileDropdown_api-key">
              <form onSubmit={handleSubmit}>
                <input type="text" value={apiKey} onChange={handleChange} placeholder="Изменить Api ключ" />
                <button type="submit">Сохранить</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;