import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import '../App.css';

const Home = () => {
    const [MyText, setMyText] = useState(0);
    const navigate = useNavigate();

    const NumberPlus = () => {
    setMyText(MyText + 1);
    // alert('숫자 1 증가!');
    };

    const NumberMinus = () => {
    setMyText(MyText - 1);
    };
//style={{ marginTop: -15, cursor: 'pointer' }}
    return (
        <div>
            <p>안녕하세요. 현재 Home.js 입니다.</p>
            <div style={{flexDirection:'row'}}>
                <button onClick={NumberPlus} className="App-button" style={{fontSize: 20}}> 숫자 + </button>
                <button onClick={NumberMinus} className="App-button" style={{fontSize: 20}}> 숫자 - </button>
            </div>
            <span style={{fontSize: 50, fontWeight:'bold'}}>{MyText}</span>
            <hr/>
            <div style={{flexDirection:'row'}}>
                <Link to='/test1' style={{margin:5}}> test1 이동 </Link>
                <Link to='/test2' style={{margin:5}}> test2 이동 </Link>
            </div>
            <br/>
            <div>
                <button onClick={() => {navigate('/test1')}} className='App-button' style={{fontSize: 20}}> test1 이동 </button>
                <button onClick={() => {navigate('/test2')}} className='App-button' style={{fontSize: 20}}> test2 이동 </button>
            </div>

        </div>
    );
};

export default Home;