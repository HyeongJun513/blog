import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/AuthContext ";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";
import Category from "../side_menu/Category";

//<ProfileImg alt="Profile" src={`${process.env.PUBLIC_URL}/img/Profile.png`}/>
const TopMenu = () => {
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
            return (
              <ButtonContainer>
                  <TopButton onClick={() => {window.open("https://github.com/HyeongJun513", "_blank");}}>GitHUB</TopButton>
                  <TopButton onClick={() => {window.open("https://hyeongjun513.github.io/blog/", "_blank");}}>Website</TopButton>
                  <TopButton onClick={() => {navigate('/login')}}>Login</TopButton>
              </ButtonContainer>
          )
        } else if (currentUser) { //로그인 상태인 경우
            return (
                <ButtonContainer>
                    <TopButton onClick={() => {navigate('/post')}}>Post</TopButton>
                    <TopButton onClick={() => {navigate('/portfolio/post')}}>Portfolio</TopButton>
                    <TopButton onClick={() => {handleLogout()}}>Logout</TopButton>
                </ButtonContainer>
            )
        } else {
            return <p>오류!</p>
        };
    };

    return (
        <Container>
            <div>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <ProfileImg alt="Profile" src={`${process.env.PUBLIC_URL}/img/Profile.png`}/>
                    <div>
                        <Nickname>코딩하는 콘스</Nickname>
                        <Name>박형준 (Park Hyeong Jun)</Name>
                        <Introduce>안녕하세요. 반갑습니다.</Introduce>
                    </div>
                </div>
                {PrintButton()}
            </div>
            <Category isTop={true} />
        </Container>
    );
};

export default TopMenu;

const Container = styled.div`
  padding: 1rem 0 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content : center;
  border-radius: 10px;

  background-color: lightgray;
`;

const Nickname = styled.p`
  font-size: 1.4rem;
  margin: 0.2rem;

  font-family: "Song Myung", serif;
  font-weight: bold;
  
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Name = styled.p`
  font-size: 0.7rem;
  margin: 0 0 0.5rem 0;
  color: gray;

  font-family: "Song Myung", serif;
  font-weight: bold;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Introduce = styled.p`
  font-size: 0.8rem;
  margin: 0.2rem;

  font-family: "Song Myung", serif;
  font-weight: bold;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileImg = styled.img`
  width: 5rem;
  border-radius: 10px;
  margin: 0 0.5rem 0 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.2rem 0 0 0;

//   background-color: lightgreen;
`

const TopButton = styled.button`
  padding: 0.15rem 0.3rem 0.15rem 0.3rem;
  width : 33%;
  height: auto;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: lightgray;
  border: 0px solid black;
  cursor: pointer;
  margin: 0;
  color: gray;

  font-family: "Song Myung", serif;
  font-style: normal;

  &: Hover {
    background-color: white;
  }
`;