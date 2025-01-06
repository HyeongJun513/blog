import React, { useState, useContext } from "react";
import Profile from "./Profile";
import Category from "./Category";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/AuthContext ";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const SideMenu = () => {
    const { currentUser } = useContext(AuthContext); //로그인 사용자 판별
    const navigate = useNavigate();

    const handleLogout = async () => { //로그아웃
        try {
          await signOut(auth);
          alert("로그아웃 성공!");
        } catch (error) {
          console.error(error);
          alert("로그아웃 실패!");
        }
      };

    const PrintButton = () => {
        if (!currentUser) { //로그아웃 상태인 경우
            return <SideButton onClick={() => {navigate('/login')}}>로그인</SideButton>
        } else if (currentUser) { //로그인 상태인 경우
            return (
                <div>
                    <SideButton onClick={() => {navigate('/post')}}>게시글 작성</SideButton>
                    <SideButton onClick={() => {handleLogout()}}>로그아웃</SideButton>
                </div>
            )
        } else {
            return <p>오류!</p>
        };
    };

    return (
        <div style={{backgroundColor:'lightgray', marginTop: 15}}>
          {/* <p style={{fontWeight:'bold', color:'white'}}>좌측 메뉴 (RightMenu.js)</p> */}
          <Profile />
          <PrintButton />
          <Category />
        </div>
    );
};

export default SideMenu;

const SideButton = styled.button`
  padding:5px 10px 5px 10px;
//   min-width: 50px;
  width : 99%;
  height: auto;
  border-radius: 2px;
  font-size: 18px;
  font-weight: 700;
  background-color: gray;
  border: 2px solid black;
  color: white;
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 5px;
`;