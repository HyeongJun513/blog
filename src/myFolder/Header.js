import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트

const Header = () => {
    const navigate = useNavigate();
    
    return (
        <header>
        {/* <Link to='/'> <h1 style={{marginTop: -15}}>개인 블로그</h1> </Link> */}
        <h1 style={{marginTop: -15, cursor: 'pointer'}} onClick={() => {navigate('/')}} >개인 블로그</h1>
        
        <hr style={{marginTop: -30}} />
    </header>
    );
};

export default Header;