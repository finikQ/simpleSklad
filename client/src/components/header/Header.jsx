import React from "react";
import "./header.less";
import Navigation from "./navigation/Navigation.jsx";
import ProfileView from "./profileview/ProfileView";

const Header = () => {
	return (
		<>
			<header className="header">
				<Navigation />
				<ProfileView />
			</header>
		</>
	);
};

export default Header;