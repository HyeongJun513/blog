import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";

const Header = () => {
    const navigate = useNavigate();

    return (
    <div>
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <div>
                <Title style={{cursor: 'pointer'}} onClick={() => {navigate('/')}} >콘스의 개발 블로그</Title>
            </div>
            
            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <MenuButton onClick={() => {navigate('/')}}>Home</MenuButton>
                <MenuButton onClick={() => {navigate('/portfolio')}}>Portfolio</MenuButton>
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
  font-size: 18px;
//   background-color: #5877f9;
//   border:2px solid #5877f9;
  background-color: lightgray;
  border: 2px solid;
//   color:#ffffff;
  margin-right: 2px;
  margin-left: 2px;
  cursor: pointer;

  font-family: "Merienda", serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
`;

const Title = styled.h1`
  font-family: "Nanum Pen Script", serif;
  font-weight: 500;
  font-style: normal;
  font-size: 2.5rem;
`;