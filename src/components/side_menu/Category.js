import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from "firebase/database";
import styled from "styled-components";

const Category = () => {
    const navigate = useNavigate();

    const [postCounts, setPostCounts] = useState({
      all: 0,
      general: 0,
      react: 0,
      reactNative: 0,
      another: 0,
    });

    useEffect(() => {
      const db = getDatabase();
      const postsRef = ref(db, "posts");
  
      const unsubscribe = onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        const postsArray = data
          ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          : [];
  
        // 게시글 개수 계산
        const counts = {
          all: postsArray.length,
          general: postsArray.filter((post) => post.category === "일반").length,
          react: postsArray.filter((post) => post.category === "React").length,
          reactNative: postsArray.filter((post) => post.category === "React-Native").length,
          another: postsArray.filter((post) => post.category === "기타").length,
        };
  
        setPostCounts(counts);
      });
  
      return () => unsubscribe();
    }, []);

    return (
        <div style={{border: '2px solid black', padding: '0.6rem', borderRadius: 10, backgroundColor:'white', margin: 0}}>
            {/* <p style={{margin: '0.5rem'}}>메뉴</p>
            <hr /> */}
            <CategoryButton onClick={() => {navigate('/list', {state : {category: '전체'}})}} style= {{margin: '0'}}>전체 ({postCounts.all})</CategoryButton>
            <hr />
            <CategoryList>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: '일반'}})}}>일반 ({postCounts.general})</CategoryButton>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: 'React'}})}} >React ({postCounts.react})</CategoryButton>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: 'React-Native'}})}} >React Native ({postCounts.reactNative})</CategoryButton>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: '기타'}})}}>기타 ({postCounts.another})</CategoryButton>
            </CategoryList>
        </div>
    );
};

export default Category;

const CategoryButton = styled.button`
  padding:5px 10px 5px 10px;
  width: auto;
  height: auto;
  font-size: 18px;
  font-weight: 700;
  background-color: white;
  border: 0px;
  margin: 0.5rem;
  cursor: pointer;

  font-family: "Song Myung", serif;
  font-weight: 400;
  font-style: normal;

  &:hover {
  text-decoration: underline;
  color: black;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
`;