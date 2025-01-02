import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import styled from "styled-components";

const List = () => {
  const [posts, setPosts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const category = location.state?.category || '전체';

  useEffect(() => {
    const db = getDatabase();
    const postsRef = ref(db, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      const postsArray = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setPosts(postsArray.reverse()); //데이터 역순 (최신 데이터 위로, 과거 데이터 아래로로)
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  const printListHeader = () =>{
    const Description = () =>{
      if (category == '전체') return <DescriptionText>전체 게시글에 대한 설명입니다.</DescriptionText> 
      else if (category == '일반') return <DescriptionText>일반 게시글에 대한 설명입니다.</DescriptionText> 
      else if (category == 'React') return <DescriptionText>React 게시글에 대한 설명입니다.</DescriptionText> 
      else if (category == 'React-Native') return <DescriptionText>RN 게시글에 대한 설명입니다.</DescriptionText> 
      else return <DescriptionText>기타 게시글에 대한 설명입니다.</DescriptionText>
    };

    return (
    <div style={{width:'90%', display:'flex', flexDirection:'column', alignItems:'start', marginTop: 10}}>
      <CategoryText>
        {category}
      </CategoryText>
      {Description()}
    </div>
    );
  };

  const printList = (post) => {
    return (
      <div style={{display:'flex', flexDirection:'column'}}>

        <ListButton onClick={() => {navigate(`/list/${post.id}`)}} >
          <Title style={{fontSize: '1.5rem'}}>{post.title}</Title>
        </ListButton>

        <Content>
          <p style={{ margin: 0, fontSize: '1rem' }}>{post.content}</p>
        </Content>

        <Tail style={{ fontSize:'0.9rem' }}>
        {post.category} &nbsp; / &nbsp; {(post.uploadTime).split(' 오후')[0]}
        </Tail>

        <hr style={{width: '100%', margin:'0.3rem 0 0 0'}}/>
        
      </div>
    );
  };

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      {printListHeader()}
      {posts.map((post) => (
        <div key={post.id} style={{width:'90%'}}>
            {/* <Link to={`/post/${post.id}`}> */}

          {category ==='전체' ? //category가 전체인 경우, 전체 게시글 목록 출력
            printList(post)
            :
            post.category === category && //category가 전체가 아닌 경우, post.category와 category가 일치하는 경우만 출력
            printList(post)
          }
        </div>
      ))}
    </div>
  );
};

export default List;

const ListButton = styled.button`
  flex-direction: column;
  height: auto;
  background-color: white;
  border: 0px;
  margin: 0;
  cursor: pointer;

  display: -webkit-box; /* 웹킷 브라우저 호환성 */
  -webkit-line-clamp: 1; /* 최대 1줄 표시 */
  -webkit-box-orient: vertical; /* 텍스트 방향 설정 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* 넘칠 경우 생략 표시 */

  &:hover {
  text-decoration: underline;
  color: #2A408E;
  }
`;

const CategoryText = styled.div`
  font-family: "Yeon Sung", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 2.5rem;
  margin: 0 0 0.3rem 0;
`;

const DescriptionText = styled.div`
  background-color: lightgray;
  color: gray; 
  width: 100%; 
  text-align: left;
  padding: 0.7rem;

  font-family: "Nanum Pen Script", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 1.7rem;
  margin: 0 0 0.7rem 0;
`;

const Content = styled.div`
  display: -webkit-box; /* 웹킷 브라우저 호환성 */
  -webkit-line-clamp: 2; /* 최대 2줄 표시 */
  -webkit-box-orient: vertical; /* 텍스트 방향 설정 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* 넘칠 경우 생략 표시 */
  background-color: white;
  text-align: left;
  margin: 0.3rem 0 0.3rem 0.2rem;
`;

const Title = styled.p`
  color: #2A408E;
  font-weight: bold;
  margin: 0.2rem 0.2rem 0.2rem -0.2rem; 
  text-align: left;
`;

const Tail = styled.p`
  display: flex;
  flex-direction: row;
  margin: 0.4rem; 
  color: gray; 
  font-weight: bold;
`;