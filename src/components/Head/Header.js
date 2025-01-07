import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";

const Header = () => {
    const navigate = useNavigate();

    return (
    <div>
        <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', margin: '1rem 0 0 0'}}>
            <div style={{margin: 0}}>
                <Title style={{cursor: 'pointer'}} onClick={() => {navigate('/')}} >콘스의 개발 블로그</Title>
            </div>
            
            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <MenuButton onClick={() => {navigate('/')}}>Home</MenuButton>
                <MenuButton onClick={() => {navigate('/portfolio')}}>Portfolio</MenuButton>
            </div>
        </div>
        {/* <hr style={{height:'0.15rem', backgroundColor:'gray', border:'0'}}/> */}
        <HR />
    </div>
    );
};

export default Header;

const MenuButton = styled.button`
  padding:5px 10px 5px 10px;
  min-width: 50px;
  height: auto;
  border-radius: 5px;
  font-size: 1.2rem;
//   background-color: #5877f9;
//   border:2px solid #5877f9;
  background-color: lightgray;
  border: 2px solid;
//   color:#ffffff;
  margin: 0 0 0 0.5rem;
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
  margin: 0.5rem 0 0 0;
`;

const HR = styled.hr`
  height : 0.2rem;
  background-color : gray;
  border : 0;
  margin: 1rem 0 1rem 0;
`