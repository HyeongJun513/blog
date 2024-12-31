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
            {/* <h3>할일 목록(1228 작성)</h3>
            <p>
                게시글 첨부파일 이미지 각각 따로, 첨부파일 여러개 받기, 
                <br />
                게시글 사진과 글 같이 쓰는 기능(HTML), 우상단 Home과 Portfolio 구분,
                <br />
                댓글 입력 기능(닉네임, 내용, 비밀번호) 등등 추가하기
            </p> */}
            <div style={{flexDirection:'row'}}>
                <NumberButton onClick={NumberPlus} > 숫자 + </NumberButton>
                <NumberButton onClick={NumberMinus} > 숫자 - </NumberButton>
            </div>
            <span style={{fontSize: 50, fontWeight:'bold'}}>{MyText}</span>

            {/* <div style={{flexDirection:'row'}}>
                <Link to='/post' style={{margin:5}}> Post 이동 </Link>
                <Link to='/list' style={{margin:5}}> List 이동 </Link>
                <br/>
                <Link to='/signup' style={{margin:5}}> SignUp 이동 </Link>
                <Link to='/login' style={{margin:5}}> Login 이동 </Link>
            </div> */}

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