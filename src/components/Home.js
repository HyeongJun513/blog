import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import '../App.css';
import styled from 'styled-components';

const Home = () => {
    const [MyText, setMyText] = useState(0);
    const navigate = useNavigate();

    const NumberPlus = () => {
    setMyText(MyText + 1);
    // alert('숫자 1 증가!');
    };

    const NumberMinus = () => {
    setMyText(MyText - 1);
    };

    return (
        <div style={{backgroundColor:'white', }}>
            <p>게시글 목록 출력 (Home.js)</p>
            <div style={{flexDirection:'row'}}>
                <NumberButton onClick={NumberPlus} > 숫자 + </NumberButton>
                <NumberButton onClick={NumberMinus} > 숫자 - </NumberButton>
            </div>
            <span style={{fontSize: 50, fontWeight:'bold'}}>{MyText}</span>

            <div style={{flexDirection:'row'}}>
                <Link to='/test1' style={{margin:5}}> test1 이동 </Link>
                <Link to='/test2' style={{margin:5}}> test2 이동 </Link>
            </div>

            <br/>
            
            <div>
                <button onClick={() => {navigate('/test1')}} className='App-button' style={{fontSize: 20}}> test1 이동 </button>
                <button onClick={() => {navigate('/test2')}} className='App-button' style={{fontSize: 20}}> test2 이동 </button>
            </div>

        </div>
    );
};

export default Home;

const NumberButton = styled.button`
  padding:5px 10px 5px 10px;
  min-width: 50px;
  height: auto;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 700;
  background-color:#5877f9;
  border:2px solid #5877f9;
  color:#ffffff;
  margin-right: 2px;
  margin-left: 2px;
  cursor: pointer;
`;