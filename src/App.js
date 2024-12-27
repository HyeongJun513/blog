import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import './App.css';
import styled from 'styled-components';
import Home from './components/Home';
import Header from './components/Header';
import Test from './components/test';
import Test2 from './components/test2';
import ErrorPage from './components/ErrorPage';
import RightMenu from './components/right_menu/RightMenu';

const App = () => {

  return (
    <div style={{fontSize: 25, textAlign: 'center'}}>
        <BrowserRouter basename='/blog'>
          <Routes>
            <Route 
            path='/'
            element={
              <Container>
                <div style={{width:'80%'}}>
                  <Header />
                  <div style={{display:'flex', backgroundColor:'white', justifyContent:'center'}}>
                    <div style={{flex: 2}}>
                      <RightMenu />
                    </div>

                    <hr style={{ width: '1px', backgroundColor: 'black', border: 'none', marginLeft:5, marginRight: 5}} />

                    <div style={{flex: 8}}>
                      <Home />
                    </div>
                  </div>
                </div>
              </Container>
            }
            />
            <Route path='test1' element={
              <Container>
                <div style={{width:'80%'}}>
                  <Header />
                  <div style={{display:'flex', backgroundColor:'white', justifyContent:'center'}}>
                    <div style={{flex: 2}}>
                      <RightMenu />
                    </div>

                    <hr style={{ width: '1px', backgroundColor: 'black', border: 'none', marginLeft:5, marginRight: 5}} />
                    
                    <div style={{flex: 8}}>
                      <Test />
                    </div>
                  </div>
                </div>
              </Container>
            }/>
            <Route path='test2' element={
              <Container>
              <div style={{width:'80%'}}>
                <Header />
                <div style={{display:'flex', backgroundColor:'white', justifyContent:'center'}}>
                  <div style={{flex: 2}}>
                    <RightMenu />
                  </div>

                  <hr style={{ width: '1px', backgroundColor: 'black', border: 'none', marginLeft:5, marginRight: 5}} />
                  
                  <div style={{flex: 8}}>
                    <Test2 />
                  </div>
                </div>
              </div>
            </Container>
            }/>
            <Route path='*' element={
              <ErrorPage />
            } />
          </Routes>
        </BrowserRouter>
    </div>
  );
};

export default App;

const Container = styled.div`
  display: flex;
  // align-items: center;
  justify-content: center;
  // height: 100vh;
  // background-color: lightgray;
`;
