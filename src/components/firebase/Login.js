import React, { useState, useContext } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { AuthContext } from "./AuthContext ";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useContext(AuthContext); // 현재 사용자 정보 가져오기

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("아이디, 비밀번호를 확인해주세요.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // 로그아웃 처리
      alert("로그아웃 성공!");
    } catch (error) {
      console.error(error);
      alert("로그아웃 실패!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    handleLogin(); // 로그인 함수 호출
    
  };

  return ( //calc(100vh - 16rem) : 좌측 사이드메뉴의 높이
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight: 'calc(100vh - 15rem)'}}>
      <Title>{currentUser ? "로그아웃" : "로그인"}</Title>
      {currentUser ? (
        // 사용자가 로그인되어 있다면 로그아웃 버튼만 표시
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', padding:'1.5rem', border:'1px solid black'}}>
          <LoginButton onClick={handleLogout} style={{margin:'0 1.5rem 0 0'}}>로그아웃</LoginButton>
          <LoginButton onClick={() => {navigate('/signup')}} style={{margin:0}}>회원가입</LoginButton>
        </div>
      ) : (
        // 사용자가 로그인되어 있지 않다면 로그인 폼 표시
        <FormStyle onSubmit={handleSubmit}> {/* form 태그 사용 */}

          <div style={{display:'flex', flexDirection:'row', alignItems:'flex-start', margin:'0.5rem 0 1rem 0'}}>
            <LoginIcon alt="person" src={`${process.env.PUBLIC_URL}/img/person.png`}/>
            <LoginInput
              type="email"
              placeholder="아이디"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{display:'flex', flexDirection:'row', alignItems:'flex-start'}}>
          <LoginIcon alt="lock" src={`${process.env.PUBLIC_URL}/img/lock.png`}/>
          <LoginInput
            type="password"
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>

          <LoginButton type="submit">로그인</LoginButton>
        </FormStyle>
      )}
    </div>
  );
};

export default Login;

const Title = styled.p`
  font-family: "Yeon Sung", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 2.5rem;
  margin: 3rem 0 0.5rem 0;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;
//style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'2rem', border:'1px solid black'}}
const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  border: 1px solid black;

  @media (max-width: 600px) {
    padding: 1.5rem
  }
`

const LoginInput = styled.input`
  font-size: 1rem;
  color: #222222;
  width: 20rem;
  border: none;
  border-bottom: solid #aaaaaa 1px;
  padding-bottom: 0.1rem;
  padding-left: 0.2rem;
  background: none;
  margin: 0.4rem 0 1rem 0.2rem;

  font-family: "Noto Sans KR", serif;
  font-weight: bold;

  &:focus { 
  outline: none; 
  }

  @media (max-width: 600px) {
    font-size: 0.7rem;
    width: 12rem;
  }
`;

const LoginIcon = styled.img`
  filter: opacity(0.6);
  width: 2rem;
  height: 2rem;
  margin: 0.2rem 0 0 0;

  @media (max-width: 600px) {
    width: 1.7rem;
    height: 1.7rem;
  }
`;

const LoginButton = styled.button`
  background-color: skyblue;
  border: 0px;
  width: 6rem;
  height: 2.2rem;
  cursor: pointer;
  color: black;
  border-radius: 8px;
  font-size: 0.9rem;
  margin: 1rem 0rem 0 0;

  font-family: "Noto Sans KR", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: 600;

  &:hover {
  background-color: #7cc6e3;
  }

  @media (max-width: 600px) {
    font-size: 0.7rem;
    width: 5rem;
    height: 2rem;
  }
`;