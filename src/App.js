import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
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

import { AuthProvider } from './components/firebase/AuthContext ';

// 공통 레이아웃 컴포넌트
const Layout = ({ children }) => {
  return (
    <Container>
      <div style={{ width: '80%'}}>
        <Header />
        <div style={{ display: 'flex', flexDirection:'row', justifyContent: 'center' }}>
          <div style={{ flex: 2 }}>
            <SideMenu />
          </div>

          {/* <hr style={{ width: '1px', backgroundColor: 'black', border: 'none', marginLeft: 10, marginRight: 10 }} /> */}

          <div style={{ flex: 8 }}>
            {children}  {/* 이 부분에서 각 페이지 컴포넌트를 렌더링 */}
          </div>
        </div>
      </div>
      <Tail/>
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
    <div style={{fontSize: 25, textAlign: 'center'}}>
      <AuthProvider>
        <BrowserRouter basename='/blog'>
          <Routes>
            <Route 
            path='/'
            element={
              <Layout>
                {/* <Home /> */}
                <List />
              </Layout>
            }
            />
            <Route path='post' element={ //게시글 작성
                <Layout>
                  <Post />
                </Layout>
            }/>
            <Route path='list' element={ //게시글 목록
                <Layout>
                  <List />
                </Layout>
            }/>
            <Route path="list/:id" element={ //게시글 조회
                <Layout>
                  <Detail />
                </Layout>
            }/>
            <Route path="edit/:id" element={ //게시글 수정
                <Layout>
                  <Edit />
              </Layout>
            }/>
            <Route path='signup' element={ //회원가입
                <Layout>
                  <SignUp />
                </Layout>
            }/>
            <Route path='login' element={ //로그인 및 로그아웃
                <Layout>
                  <Login />
                </Layout>
            }/>
            <Route path='portfolio' element={
                <Layout>
                  <PortfolioHome />
                </Layout>
            }/>
            <Route path='portfolio/post' element={
                <Layout>
                  <PortfolioPost />
                </Layout>
            }/>
            <Route path='test1' element={
                <Layout>
                  <Test />
                </Layout>
            }/>
            <Route path='test2' element={
                <Layout>
                  <Test2 />
                </Layout>
            }/>
            <Route path='*' element={ //경로가 잘못된 경우 에러페이지 출력
              <ErrorPage />
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // height: 100vh;
  // background-color: lightgray;
`;
