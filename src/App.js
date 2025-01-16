import React, { useState, useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import { getDatabase, ref, get, set } from 'firebase/database';
import './App.css';
import styled from 'styled-components';
import Home from './components/Home';
import Header from './components/Head/Header';
import Tail from './components/Head/Tail';
import Test from './components/test';
import Test2 from './components/test2';
import ErrorPage from './components/ErrorPage';
import SideMenu from './components/side_menu/SideMenu';
import List from './components/firebase/List';
import Post from './components/firebase/Post';
import Login from './components/firebase/Login';
import SignUp from './components/firebase/SignUp';
import Detail from './components/firebase/Detail';
import Edit from './components/firebase/Edit';
import PortfolioHome from './components/Portfolio/PortfolioHome';
import PortfolioPost from './components/Portfolio/PortfolioPost';
import PortfolioEdit from './components/Portfolio/PortfolioEdit';

import { AuthProvider } from './components/firebase/AuthContext ';

// 공통 레이아웃 컴포넌트
const Layout = ({ children }) => {
  return (
    <Container>
      {/* Header 고정 */}
      <HeaderContainer>
        <Header />
      </HeaderContainer>

      {/* 본문 레이아웃 */}
      <MainContent>
        {/* SideMenu 고정 */}
        <SideMenuContainer>
          <SideMenu />
        </SideMenuContainer>
        {/* 스크롤 가능한 영역 */}
        <ScrollableContent>
          {children}
        </ScrollableContent>
      </MainContent>

      {/* Footer (Tail) */}
      <TailContainer>
        <Tail />
      </TailContainer>
    </Container>
  );
};

const App = () => {
  const VisitorCount = async () => { //방문자 카운트
    const db = getDatabase();
    const visitorsRef = ref(db, "visitors"); //누적 방문자
    const dailyVisitorsRef = ref(db, "dailyVisitors"); //오늘자 방문자(수동 초기화)
  
    await get(visitorsRef).then(async (snapshot) => {
      if (snapshot.exists()) {
        // 방문자 수 1 증가
        await set(visitorsRef, snapshot.val() + 1);
      } else {
        // 초기화
        await set(visitorsRef, 1);
      }
    });

    await get(dailyVisitorsRef).then(async (snapshot) => {
      if (snapshot.exists()) {
        // 방문자 수 1 증가
        await set(dailyVisitorsRef, snapshot.val() + 1);
      } else {
        // 초기화
        await set(dailyVisitorsRef, 1);
      }
    });
  };
  


  useEffect(() => {
    VisitorCount();
  }, []);

  return (
    <div style={{textAlign: 'center'}}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout><List /></Layout>} />
            <Route path="post" element={<Layout><Post /></Layout>} />
            <Route path="list" element={<Layout><List /></Layout>} />
            <Route path="list/:id" element={<Layout><Detail /></Layout>} />
            <Route path="edit/:id" element={<Layout><Edit /></Layout>} />
            <Route path="signup" element={<Layout><SignUp /></Layout>} />
            <Route path="login" element={<Layout><Login /></Layout>} />
            <Route path="portfolio" element={<Layout><PortfolioHome /></Layout>} />
            <Route path="portfolio/post" element={<Layout><PortfolioPost /></Layout>} />
            <Route path="portfolio/edit" element={<Layout><PortfolioEdit /></Layout>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </div>
  );
};

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  // display: flex;
  // flex-direction: column;
  // width: 100%;
  // height: 100vh; /* Viewport 전체 높이 */
  // overflow: hidden; /* 전체 스크롤바를 숨김 */
`;

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 10%;
  right: 10%;
  width: 80%;
  height: 6rem;
  z-index: 1; /* 다른 요소 위에 표시, 크기가 클수록 우선순위 */
  background-color: white; /* 필요 시 배경색 지정 */

  // position: fixed;
  // top: 0;
  // left: 10%;
  // right: 10%;
  // width: 80%;
  // height: 6rem;
  // z-index: 1;
  // background-color: white;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-top: 7rem; /* Header 높이만큼 아래로 배치 */
  width: 80%;

  // display: flex;
  // flex-direction: row;
  // margin-top: 6rem; /* Header 높이만큼 아래로 배치 */
  // flex: 1; /* 남은 공간 차지 */
  // overflow: hidden; /* 내부에서만 스크롤 제어 */
`;

const SideMenuContainer = styled.div`
  position: fixed;
  top: 7rem; /* Header 높이 아래로 배치 */
  width: calc(80vw * 0.2); /* 전체 width 80% 중의 20% */
  height: calc(100vh - 7rem); /* Header, Tail 제외 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤 가능 */
  // background-color: lightgray; /* 필요 시 배경색 지정 */

  // width: calc(80vw * 0.2); /* 전체 width 80% 중의 20% */
  // height: calc(100vh - 6rem - 8rem); /* Header와 Tail 높이를 뺀 공간 */
  // overflow-y: auto; /* 스크롤 활성화 */
  // position: sticky; /* 화면을 스크롤해도 고정 */
  // top: 6rem; /* Header 아래에 고정 */
  // background-color: white; /* 테스트용 배경색 */

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background: gray; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 둥글게 */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5F5F5F; /* 호버 시 스크롤바 색상 */
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* 스크롤바 배경 투명 */
  }
`;

const ScrollableContent = styled.div`
  margin-left: calc(80vw * 0.2); /* SideMenu 너비만큼 여백 */
  width: calc(80vw * 0.8); /* 전체 width 80% 중의 80% */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  border-left: 1px solid lightgray;
  background-color:

  // width: calc(80vw * 0.8); /* 전체 width 80% 중의 80% */
  // margin-left: calc(80vw * 0.2); /* SideMenu 너비만큼 여백 */
  // overflow-y: auto; /* 세로 스크롤 활성화 */
`;

const TailContainer = styled.div`
  width: 100%;
  z-index: 1; /* 다른 요소 위에 표시, 크기가 클수록 우선순위 */

  // height: 8rem;
  // width: 100%;
  // background-color: lightgray; /* 테스트용 배경색 */
  // position: relative;
  // background-color: skyblue;
`


// // 공통 레이아웃 컴포넌트
// const Layout = ({ children }) => {
//   return (
//     <Container>
//       <div style={{ width: '80%'}}>
//         <Header />
//         <div style={{ display: 'flex', flexDirection:'row', justifyContent: 'center' }}>
//           <div style={{ flex: 2 }}>
//             <SideMenu />
//           </div>

//           <div style={{ flex: 8 }}>
//             {children}  {/* 이 부분에서 각 페이지 컴포넌트를 렌더링 */}
//           </div>
//         </div>
//       </div>
//       <Tail/>
//     </Container>
//   );
// };

