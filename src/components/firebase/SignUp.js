import React, { useState, useContext } from "react";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "./AuthContext ";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [check, setCheck] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const correctAdminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 성공!");
    } catch (error) {
      console.error(error);
      alert("회원가입 실패!" + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp();
  };

  const adminCheck = (e) => {
    e.preventDefault();
    adminPassword == correctAdminPassword ? alert('인증 성공!') : alert('인증 실패!')
    adminPassword == correctAdminPassword ? setCheck(true) : setCheck(false);
  };

  return (
    <div style={{minHeight: 'calc(100vh - 15rem)'}}>
    { 
    currentUser ?
    <div>
      <h2>관리자 인증 페이지</h2>
      <h3 style={{color: 'red'}}>! 로그아웃이 필요합니다 !</h3>
    </div>
    :
    (
    check ?
      <form onSubmit={handleSubmit}>
      <h2>회원가입</h2>
      <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
      <input type="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)} /> <br />
      <button type="submit">회원가입</button>
      </form>
      :
      <form onSubmit={adminCheck}>
      <h2>관리자 인증</h2>
      <input type="password" onChange={(e) => setAdminPassword(e.target.value)}></input>
      <button type="submit">인증하기</button>
      </form>
    )
    }
    </div>
  );
};

export default SignUp;
