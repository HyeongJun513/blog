import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import styled from "styled-components";
import { marked } from "marked"; //markdown을 html 방식으로 변환하는 모듈

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
      console.log('data : ', data)
      const postsArray = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        .filter((post) => validatePost(post)) // 유효한 게시글만 필터링
        : [];
      setPosts(postsArray.reverse()); //데이터 역순 (최신 데이터 위로, 과거 데이터 아래로로)
    });

    return () => unsubscribe();
  }, []);

  // 게시글 유효성 검사 함수 (잘못된 데이터가 있다면 출력값 없음)
  const validatePost = (post) => {
    return (
      typeof post.title === "string" && post.title.trim() !== "" &&
      typeof post.content === "string" && post.content.trim() !== "" &&
      typeof post.category === "string" && post.category.trim() !== ""
    );
  };

  const printListHeader = () =>{
    const Description = () =>{
      if (category == '전체') return <DescriptionText>전체 게시글 한눈에 보기</DescriptionText> 
      else if (category == '일반') return <DescriptionText>일반적인 이모저모</DescriptionText> 
      else if (category == 'React') return <DescriptionText>React 공부 및 프로젝트</DescriptionText> 
      else if (category == 'React-Native') return <DescriptionText>RN 공부 및 프로젝트</DescriptionText> 
      else return <DescriptionText>기타</DescriptionText>
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
    const stripMarkdown = (markdown) => { //미리보기에 마크다운 코드 제거 함수
      const html = marked.parse(markdown); //Markdown 텍스트를 HTML 문자열로 변환
      const tempDiv = document.createElement("div"); //임시 div엘리먼트 생성.
      tempDiv.innerHTML = html; //임시 div 엘리먼트 내부에 변환된 HTML 삽입
      return tempDiv.textContent || tempDiv.innerText || ""; //임시 div 엘리먼트 내부에 존재하는 텍스트만 추출 //textContent가 작동하지 않는 브라우저인 경우 innerText 사용, 그도 안되면 그냥 공백값 반환
    }; //textContent: HTML 태그를 무시하고 모든 텍스트를 반환. //innerText: 화면에 보이는 텍스트만 반환 (<h4 style="display:none">숨겨진 제목</h4> 인 경우 반환하지 않음).
    
    const previewText = stripMarkdown(post.content);

    return (
      <div style={{display:'flex', flexDirection:'column'}}>

        <ListButton onClick={() => {navigate(`/list/${post.id}`, {state : {sortedPosts: posts}})}} >
          <Title style={{fontSize: '1.5rem'}}>{post.title}</Title>
        </ListButton>

        <Content>
          <p style={{ margin: 0, fontSize: '1rem' }}>{previewText}</p>
        </Content>

        <Tail style={{ fontSize:'0.9rem' }}>
        <TailIcon alt="folder" src={`${process.env.PUBLIC_URL}/img/folder.png`}/> {post.category} &nbsp;&nbsp;&nbsp;
        <TailIcon alt="date" src={`${process.env.PUBLIC_URL}/img/date.png`}/> {(post.uploadTime).split(' 오후')[0]}
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
  width: calc(100% - 1.4rem); 
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
  align-items: center;
  margin:  0.1rem 0 0 0.2rem; 
  color: gray; 
  font-weight: bold;
`;

const TailIcon = styled.img`
  filter: opacity(0.6);
  width: 1.2rem;
  height: 1.2rem;
  margin: 0.4rem 0.1rem 0.4rem 0;
`;