import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import styled from "styled-components";

const Header = () => {
    const navigate = useNavigate();
    return (
    <div>
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <div>
                <h1 style={{cursor: 'pointer', backgroundColor:'lightgray'}} onClick={() => {navigate('/')}} >Park's Blog</h1>
                {/* <Link to='/'> <h1 style={{marginTop: -15}}>개인 블로그</h1> </Link> */}
            </div>
            
            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                {/* <p style={{marginRight:5}}>Home</p>
                <p style={{marginLeft:5}}>Portfolio</p> */}
                <MenuButton onClick={() => {alert('홈 버튼 클릭!')}}>Home</MenuButton>
                <MenuButton onClick={() => {alert('포트폴리오 버튼 클릭!')}}>Portfolio</MenuButton>
            </div>
        </div>
        <hr style={{marginTop: -20}}/>
    </div>
    );
};

export default Header;

const MenuButton = styled.button`
  padding:5px 10px 5px 10px;
  min-width: 50px;
  height: auto;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 700;
//   background-color: #5877f9;
//   border:2px solid #5877f9;
  background-color: lightgray;
  border: 2px solid;
//   color:#ffffff;
  margin-right: 2px;
  margin-left: 2px;
  cursor: pointer;
`;