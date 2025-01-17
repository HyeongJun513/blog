import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import styled from 'styled-components';
import { AuthContext } from './firebase/AuthContext ';

const Home = () => {
    const [MyText, setMyText] = useState(0);
    const navigate = useNavigate();

    const { currentUser } = useContext(AuthContext); //로그인 사용자 판별
    // console.log(currentUser);
    // console.log(currentUser.email);

    const NumberPlus = () => {
    setMyText(MyText + 1);
    // alert('숫자 1 증가!');
    };

    const NumberMinus = () => {
    setMyText(MyText - 1);
    };

    const islogin = () => {
        if (!currentUser) {
            return <div>현재 비로그인 상태입니다.</div>;
        } else if (currentUser) {
            return <div>현재 로그인 사용자입니다.</div>
        } else {
            return <div>오류입니다.</div>
        };
    };

    return (
        <div style={{backgroundColor:'white', }}>
            <p>게시글 목록 출력 (Home.js)</p>
            <h3>할일 목록(0117 수정)</h3>
            <p>
                게시글 검색기능 추가 고려
                <br />
                모바일 전용 UI(웹 창 크기에 따라 Dimencions마냥)
                <br />
                App에서는 innerWidth이용, 기타 컴포넌트 내부에서는 css media 이용하면 될듯?
            </p>
            <div style={{flexDirection:'row'}}>
                <NumberButton onClick={NumberPlus} > 숫자 + </NumberButton>
                <NumberButton onClick={NumberMinus} > 숫자 - </NumberButton>
            </div>
            <span style={{fontSize: 50, fontWeight:'bold'}}>{MyText}</span>

            <br/>
            
            <div>
                <button onClick={() => {navigate('/test1', {state : {s1: 'a', s2: 'b'}})}} style={{fontSize: 20}}> test1 이동 </button>
                <button onClick={() => {navigate('/test2')}} style={{fontSize: 20}}> test2 이동 </button>
            </div>
            {islogin()}
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