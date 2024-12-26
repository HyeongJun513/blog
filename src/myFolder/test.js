import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트

const Test = () => {
    const testStyle = {
        backgroundColor: 'green',
    }
    
    return (
        <div style={{backgroundColor:'green', paddingLeft: 15, paddingRight: 15, color:'white'}}>
            <h1>안녕하세요. 현재 page1 입니다.</h1>
            <Link to='/test2' style={{color:'white'}}> page2 이동 </Link>
        </div>
    )
}

export default Test;