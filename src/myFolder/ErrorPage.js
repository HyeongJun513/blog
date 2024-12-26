import React from "react"
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트

const ErrorPage = () => {
    return (
        <div>
            <h3>잘못된 페이지입니다.</h3>
            <Link to='/'>홈으로 돌아가기기</Link>
        </div>
    );
};

export default ErrorPage;