import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트

const Test = () => {
    const location = useLocation();
    // const a = location.state.s1 ? location.state.s1 : 'no';
    // console.log(a);

    const testStyle = {
        backgroundColor: 'green',
    }
    
    return (
        <div style={{backgroundColor:'green', paddingLeft: 15, paddingRight: 15, color:'white'}}>
            <h1>안녕하세요. 현재 page1 입니다.</h1>
            <Link to='/test2' style={{color:'white'}}> page2 이동 (넘어온 값: {})</Link>
        </div>
    )
}

export default Test;