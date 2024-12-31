import React, { useState, useContext } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { AuthContext } from "./AuthContext ";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useContext(AuthContext); // 현재 사용자 정보 가져오기

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("로그인 실패!");
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

  return (
    <div>
      <h2>{currentUser ? "로그아웃" : "로그인"}</h2>
      {currentUser ? (
        // 사용자가 로그인되어 있다면 로그아웃 버튼만 표시
        <div>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        // 사용자가 로그인되어 있지 않다면 로그인 폼 표시
        <form onSubmit={handleSubmit}> {/* form 태그 사용 */}
          <input
            type="email"
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">로그인</button>
        </form>
      )}
    </div>
  );
};

export default Login;
