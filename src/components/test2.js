import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트

const Test2 = () => {
    const testStyle = {
        backgroundColor: 'green',
    }

    return (
        <div style={{backgroundColor:'blue', paddingLeft: 15, paddingRight: 15, color:'yellow'}}>
            <h1>안녕하세요. 현재 page2 입니다.</h1>
            <Link to='/test1' style={{color:'yellow'}}> page1 이동 </Link>
        </div>
    )
}

export default Test2;