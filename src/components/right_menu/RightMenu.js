import React from "react";
import Profile from "./Profile";
import Category from "./Category";

const RightMenu = () => {
    return (
        <div style={{backgroundColor:'skyblue', }}>
            {/* <p style={{fontWeight:'bold', color:'white'}}>우측 메뉴 (RightMenu.js)</p> */}
            <Profile />
            <Category />
        </div>
    );
};

export default RightMenu;