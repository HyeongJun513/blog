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
    const [categoryHidden, setCategoryHidden] = useState(false);

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

    const changeCategoryHidden = () => {
      categoryHidden ? setCategoryHidden(false) : setCategoryHidden(true);
    };

    return ( //▼ ▲
        <Container>
          <Title>
            <NoneDiv>▼</NoneDiv>
            <TitleFont>카테고리</TitleFont>
            {categoryHidden ? 
              <CategoryHiddenButton onClick={() => {changeCategoryHidden()}}>▼</CategoryHiddenButton>
            :
              <CategoryHiddenButton onClick={() => {changeCategoryHidden()}}>▲</CategoryHiddenButton>
            }
            
          </Title>

          {categoryHidden ? '' :
          <CategoryList>
            <AllCategoryDiv>
              <AllCategoryIcon alt="folder" src={`${process.env.PUBLIC_URL}/img/folder.png`}/>
              <CategoryButton onClick={() => {navigate('/list', {state : {category: '전체'}})}} style= {{margin: '0'}}>전체 글 ({postCounts.all})</CategoryButton>
            </AllCategoryDiv>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: '일반'}})}}>일반 ({postCounts.general})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: 'React'}})}} >React ({postCounts.react})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: 'React-Native'}})}} >React Native ({postCounts.reactNative})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: '기타'}})}}>기타 ({postCounts.another})</CategoryButton>
            
            {/* <CategoryButton onClick={() => {navigate('/list', {state : {category: '일반'}})}}>일반 ({postCounts.general})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: 'React'}})}} >React ({postCounts.react})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: 'React-Native'}})}} >React Native ({postCounts.reactNative})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: '기타'}})}}>기타 ({postCounts.another})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: '일반'}})}}>일반 ({postCounts.general})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: 'React'}})}} >React ({postCounts.react})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: 'React-Native'}})}} >React Native ({postCounts.reactNative})</CategoryButton>
            <CategoryButton onClick={() => {navigate('/list', {state : {category: '기타'}})}}>기타 ({postCounts.another})</CategoryButton> */}
          </CategoryList>
          }
        </Container>
    );
};

export default Category;

const Container = styled.div`
  // border: 2px dotted gray;
  padding: 0.6rem;
  border-radius: 10px;
  background-color: white;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  width: 95%;
  display: flex;
  flex-direcion: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid gray;
  margin: 0 0 0.8rem 0;
  padding: 0.3rem 0 0.3rem 0;
`

const TitleFont = styled.div`
  font-family: "Song Myung", serif;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0;
`;

const CategoryHiddenButton = styled.button`
  background-color: white;
  margin : 0.1rem;
  padding: 0 0 0 0;
  font-size: 0.9rem;
  border: 0;
  color: gray;

  &:hover {
    cursor: pointer;
  }
`;

const NoneDiv = styled.button`
  background-color: white;
  margin : 0.1rem;
  padding: 0 0 0 0;
  font-size: 0.9rem;
  border: 0;
  color: white
`

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  padding: 0 0 0.8rem 0;
  border-bottom: 2px solid gray;
`;

const AllCategoryDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 0 0.3rem 0;
  padding: 0 0 0.8rem 0;
  width: 95%;
  border-bottom: 3px dotted lightgray;
`;

const AllCategoryIcon = styled.img`
  width: 1rem;
  height: 1rem;
  filter: opacity(0.8);
`;

const CategoryButton = styled.button`
  width: auto;
  height: auto;
  font-size: 1rem;
  font-weight: 700;
  background-color: white;
  border: 0px;
  margin: 0.5rem 0 0 0;
  cursor: pointer;

  font-family: "Song Myung", serif;
  font-weight: bold;
  font-style: normal;

  &:hover {
  text-decoration: underline;
  color: black;
  }
`;