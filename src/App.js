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
import TopMenu from './components/Head/TopMenu';
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

//레이아웃 기준치
//1600이하 : 글씨크기 조정
//1024이하 : 사이드메뉴 삭제
//767이하 : 모바일 UI

const WindowDimensions = () => { //웹 창 크기 인식 //내 컴퓨터 기준, 최대치 1920, 최소치 500
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

// 공통 레이아웃 컴포넌트
const Layout = ({ children }) => {
  const { width } = WindowDimensions();

  return (
    <Container>
      {/* Header 고정 */}
      <HeaderContainer>
        <Header />
        {/* {width} */}
      </HeaderContainer>

      {/* 모바일, 테블릿 전용 상단 메뉴 */}
      {width <= 1024 && 
      <TopMenuContainer>
        <TopMenu />
      </TopMenuContainer>}

      {/* 본문 레이아웃 */}
      <MainContent>
        {/* SideMenu 고정 */}
        {width > 1024 && 
        <SideMenuContainer>
          <SideMenu />
        </SideMenuContainer>
        }

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
  const { width } = WindowDimensions();

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
            <Route path="width" element={<div style={{marginTop:'10rem', fontSize:'3rem'}}><HeaderContainer><Header/></HeaderContainer>현재 width 값 : {width}</div>} /> {/* width 테스트 주소 */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </div>
  );
};

export default App;

//모바일 UI 테스트
{/* <Routes>
<Route path="/" element={<Layout1024>{width}<List /></Layout1024>} />
<Route path="post" element={<Layout1024><Post /></Layout1024>} />
<Route path="list" element={<Layout1024><List /></Layout1024>} />
<Route path="list/:id" element={<Layout1024><Detail /></Layout1024>} />
<Route path="edit/:id" element={<Layout1024><Edit /></Layout1024>} />
<Route path="signup" element={<Layout1024><SignUp /></Layout1024>} />
<Route path="login" element={<Layout1024><Login /></Layout1024>} />
<Route path="portfolio" element={<Layout1024><PortfolioHome /></Layout1024>} />
<Route path="portfolio/post" element={<Layout1024><PortfolioPost /></Layout1024>} />
<Route path="portfolio/edit" element={<Layout1024><PortfolioEdit /></Layout1024>} />
<Route path="width" element={<div style={{marginTop:'10rem', fontSize:'3rem'}}><HeaderContainer><Header/></HeaderContainer>현재 width 값 : {width}</div>} />}
<Route path="*" element={<ErrorPage />} />
</Routes> */}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
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

  @media (max-width: 1024px) {
    height: 5rem;
  }
`;

const TopMenuContainer = styled.div`
  width: 80%;
  // height: 5rem;
  margin: 7rem 0 0 0;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-top: 7rem; /* Header 높이만큼 아래로 배치 */
  width: 80%;

  @media (max-width: 1024px) {
    margin-top: 1rem;
  }
`;

const SideMenuContainer = styled.div`
  position: fixed;
  top: 7rem; /* Header 높이 아래로 배치 */
  width: calc(80vw * 0.15); /* 전체 width 80% 중의 15% */
  height: calc(100vh - 7rem); /* Header, Tail 제외 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤 가능 */

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
  margin-left: calc(80vw * 0.15); /* SideMenu 너비만큼 여백 */
  width: calc(80vw * 0.85); /* 전체 width 80% 중의 85% */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  border-left: 1px solid lightgray;

  // 창 크기별 디자인
  // @media (max-width: 1024px) and (min-width: 767px) {
  @media (max-width: 1024px) {
    margin-left: 0;
    width: calc(80vw);
    border-right: 1px solid lightgray;
  }
`;

const TailContainer = styled.div`
  width: 100%;
  z-index: 1; /* 다른 요소 위에 표시, 크기가 클수록 우선순위 */
`;

