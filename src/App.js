import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import './App.css';
import Home from './myFolder/Home';
import Header from './myFolder/Header';
import Test from './myFolder/test';
import Test2 from './myFolder/test2';
import ErrorPage from './myFolder/ErrorPage';

const App = () => {

  return (
    <div className="App" style={{fontSize: 25}}>
        <BrowserRouter basename='/blog'>
          <Routes>
            <Route 
            path='/'
            element={
              <div>
                <Header />
                <Home />
              </div>
            }
            />
            <Route path='test1' element={
              <div>
                <Header />
                <Test />
              </div>
              
            }/>
            <Route path='test2' element={
              <div>
                <Header />
                <Test2 />
              </div>
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

/* 
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
*/
