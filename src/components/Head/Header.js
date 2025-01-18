import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";

const Header = () => {
    const navigate = useNavigate();

    return (
    <div>
        <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', padding: '1rem 0 0 0'}}>
            <div style={{margin: 0}}>
                <Title style={{cursor: 'pointer'}} onClick={() => {navigate('/')}} >콘스의 개발 블로그</Title>
            </div>
            
            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <MenuButton onClick={() => {navigate('/')}}>Home</MenuButton>
                <MenuButton onClick={() => {navigate('/portfolio')}}>Portfolio</MenuButton>
            </div>
        </div>
        <HR />
    </div>
    );
};

export default Header;

const Title = styled.h1`
  font-family: "Nanum Pen Script", serif;
  font-weight: 500;
  font-style: normal;
  font-size: 2.5rem;
  margin: 0.5rem 0 0 0;

  @media (max-width: 1024px) {
    font-size: 1.8rem;
  }
`;

const MenuButton = styled.button`
  padding: 5px 10px;
  min-width: 50px;
  font-size: 1.2rem;
  background-color: white;
  border: none;
  margin: 0 0.1rem;
  cursor: pointer;
  font-family: "Merienda", serif;
  font-weight: 700;
  font-style: normal;
  color: black;

  position: relative; /* ::after를 기준으로 position 설정 */
  &:hover {
    color: gray;
  }

  /* 밑줄 애니메이션 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0; /* 버튼의 글씨 바로 아래 */
    left: 50%; /* 중앙에서 시작 */
    width: 0%; /* 초기 너비 0% */
    height: 2px; /* 밑줄 두께 */
    background-color: gray; /* 밑줄 색상 */
    transform: translateX(-50%); /* 가운데 정렬 */
    transition: width 0.3s ease-out; /* 부드러운 확장 애니메이션 */
  }

  &:hover::after {
    width: 80%; /* 마우스를 올리면 너비가 버튼 전체로 확장 */
  }

  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
`;

const HR = styled.hr`
  height : 0.2rem;
  background-color : gray;
  border : 0;
  margin: 1rem 0 0 0;
`