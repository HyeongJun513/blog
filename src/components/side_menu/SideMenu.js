import React, { useState, useContext, useEffect } from "react";
import Profile from "./Profile";
import Category from "./Category";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/AuthContext ";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";

const SideMenu = () => {
    const [visitors, setVisitors] = useState(0);
    const [dailyVisitor, setDailyVisitor] = useState(0);
    const { currentUser } = useContext(AuthContext); //로그인 사용자 판별
    const navigate = useNavigate();

      useEffect(() => {
        const db = getDatabase();
        const visitorsRef = ref(db, "visitors");
        const dailyVisitorsRef = ref(db, "dailyVisitors");
        // setTest(visitorsRef);
        // console.log('방문자 : ', visitorsRef);
    
        const visitorsCounter = onValue(visitorsRef, (snapshot) => {
          const data = snapshot.val();
          // console.log('data1 실행됨!!! : ', data);
          setVisitors(data);
        });

        const dailyVisitorsCounter = onValue(dailyVisitorsRef, (snapshot) => {
          const data = snapshot.val();
          setDailyVisitor(data);
        })
    
        return () => {visitorsCounter(); dailyVisitorsCounter();}
      }, []);

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
                    <SideButton onClick={() => {navigate('/portfolio/post')}}>포트폴리오 작성</SideButton>
                    <SideButton onClick={() => {handleLogout()}}>로그아웃</SideButton>
                </div>
            )
        } else {
            return <p>오류!</p>
        };
    };

    return (
        <Container>
          {/* <p style={{fontWeight:'bold'}}>좌측 메뉴 (RightMenu.js)</p> */}
          <Profile />
          <PrintButton />
          <Category />
          <VisitorContainer>
            <VisitorText style={{borderBottomRightRadius:'0', borderTopRightRadius:'0'}}>Today</VisitorText>
            <VisitorText style={{borderBottomLeftRadius:'0', borderTopLeftRadius:'0', backgroundColor:'skyblue', color: 'white'}}>{dailyVisitor}</VisitorText>
            <VisitorText style={{borderBottomRightRadius:'0', borderTopRightRadius:'0', marginLeft:'1rem'}}>Total</VisitorText>
            <VisitorText style={{borderBottomLeftRadius:'0', borderTopLeftRadius:'0', backgroundColor:'skyblue', color: 'white'}}>{visitors}</VisitorText>
          </VisitorContainer>
        </Container>
    );
};

export default SideMenu;

const Container = styled.div`
  padding: 0 calc(80vw * 0.8 * 0.025) 10rem calc(80vw * 0.8 * 0.025);
  // border: 1px solid black;
  // margin-right: calc(80vw * 0.8 * 0.025);
  // margin-left: calc(80vw * 0.8 * 0.025);
  // background-color: skyblue;
`;

const SideButton = styled.button`
  padding: 0.3rem 0.6rem 0.3rem 0.6rem;
  width : 99%;
  height: auto;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  background-color: lightgray;
  border: 2px solid black;
  cursor: pointer;
  margin: 0.2rem 0 0.2rem 0
`;

const VisitorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0 0 0;
`;
const VisitorText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: gray;
  color: white;
  height: 1.5rem;
  padding: 0 0.4rem 0 0.4rem;
  border-radius: 2px;
  margin: 0;
`