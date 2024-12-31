import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from "firebase/database";
import styled from "styled-components";

const Category = () => {
    const navigate = useNavigate();
    const [Hover1, setHover1] = useState(false);
    const [Hover2, setHover2] = useState(false);
    const [Hover3, setHover3] = useState(false);
    const [Hover4, setHover4] = useState(false);
    const [Hover5, setHover5] = useState(false);

    const [postCounts, setPostCounts] = useState({
      all: 0,
      general: 0,
      react: 0,
      "react-native": 0,
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
          general: postsArray.filter((post) => post.category === "general").length,
          react: postsArray.filter((post) => post.category === "react").length,
          "react-native": postsArray.filter((post) => post.category === "react-native").length,
          another: postsArray.filter((post) => post.category === "another").length,
        };
  
        setPostCounts(counts);
      });
  
      // Clean up subscription
      return () => unsubscribe();
    }, []);

    return (
        <div style={{border: '2px solid black', padding: 1, borderRadius: 10, backgroundColor:'white', margin: 0}}>
            <p>메뉴</p>
            <hr />
            <div style={{display: 'flex', flexDirection:'column'}}>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: 'all', name: '전체'}})}} onMouseOver={() => {setHover1(true)}} onMouseOut={() => {setHover1(false)}} style={{color: Hover1 === true ? 'lightgray' : 'black'}}>전체 ({postCounts.all})</CategoryButton>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: 'general', name: '일반'}})}} onMouseOver={() => {setHover2(true)}} onMouseOut={() => {setHover2(false)}} style={{color: Hover2 === true ? 'lightgray' : 'black'}}>일반 ({postCounts.general})</CategoryButton>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: 'react', name: 'React'}})}} onMouseOver={() => {setHover3(true)}} onMouseOut={() => {setHover3(false)}} style={{color: Hover3 === true ? 'lightgray' : 'black'}}>React ({postCounts.react})</CategoryButton>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: 'react-native', name: 'React Native'}})}} onMouseOver={() => {setHover4(true)}} onMouseOut={() => {setHover4(false)}} style={{color: Hover4 === true ? 'lightgray' : 'black'}}>RN ({postCounts['react-native']})</CategoryButton>
                <CategoryButton onClick={() => {navigate('/list', {state : {category: 'another', name: '기타'}})}} onMouseOver={() => {setHover5(true)}} onMouseOut={() => {setHover5(false)}} style={{color: Hover5 === true ? 'lightgray' : 'black'}} >기타 ({postCounts.another})</CategoryButton>
            </div>
        </div>
    );
};

export default Category;

const CategoryButton = styled.button`
  padding:5px 10px 5px 10px;
//   min-width: 50px;
  width: auto;
  height: auto;
//   border-radius: 5px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: underline;
  background-color: white;
  border: 0px;
//   color:#ffffff;
  margin: 10px;
  cursor: pointer;
`;