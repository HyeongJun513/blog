import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref, get, set, push, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { AuthContext } from "./AuthContext ";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";

const Detail = () => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 목록 상태
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [comment, setComment] = useState("");
  
  const navigate = useNavigate(); // 삭제 후 List 페이지로 이동하기 위해 사용
  const location = useLocation();

  const db = getDatabase(); // Realtime Database 사용
  const { currentUser } = useContext(AuthContext); // 현재 사용자 정보 가져오기
  const sortedPosts = location.state?.sortedPosts || []; //게시글 목록 배열
  const currentIndex = sortedPosts.findIndex((p) => p.id === id); //현재 게시글의 배열 인덱스 추출
  // console.log('sortedPosts : ', sortedPosts);
  // console.log('인덱스 : ', currentIndex);
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null; //다음 게시글
  const previousPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null; //이전 게시글
  // console.log('previousPost : ', previousPost);
  // console.log('nextPost : ', nextPost);

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      const postRef = ref(db, "posts/" + id);
      const snapshot = await get(postRef);
      if (snapshot.exists()) {
        setPost(snapshot.val());
      } else {
        console.error("게시글을 찾을 수 없습니다.");
      }
    };

    // 댓글 데이터 가져오기
    const fetchComments = async () => {
      const commentsRef = ref(db, `comments/${id}`); // 게시글에 연결된 댓글
      const snapshot = await get(commentsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setComments(Object.entries(data).map(([key, value]) => ({ id: key, ...value })));
      } else {
        setComments([]); // 댓글이 없는 경우 상태를 빈 배열로 초기화
      };
    };

    const incrementViewCount = async () => { // 게시글 조회수(View+1)
      const postRef = ref(db, `posts/${id}/views`);
  
      await get(postRef).then(async (snapshot) => {
        if (snapshot.exists()) {
          await set(postRef, snapshot.val() + 1);
        } else {
          await set(postRef, 1); // 조회수가 없을 경우 초기화
        }
      });
    };

    fetchPost();
    fetchComments();
    incrementViewCount();
  }, [id]);

  // 게시글 삭제 함수
  const handleDelete = async () => {
    const storage = getStorage();

    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const postRef = ref(db, "posts/" + id); // Database에서 삭제할 참조
        const fileURL = post?.fileURL; // Storage 파일 경로 확인
  
        // Realtime Database에서 게시글 삭제
        await remove(postRef);
  
        // Storage 파일 삭제
        if (fileURL) {
          const fileRef = storageRef(storage, fileURL); // 파일의 Storage 참조 생성
          await deleteObject(fileRef); // 파일 삭제
        }
  
        alert("게시글이 삭제되었습니다!");
        navigate("/list");
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  // 게시글 수정 함수
  const handleEdit = () => {
    navigate(`/edit/${id}`); // 수정 페이지로 이동
  };

  // 댓글 추가 함수
  const handleAddComment = async () => {
    console.log('comments 값 : ', comments);
    console.log('comments 개수 : ', comments.length);
    if (!nickname || !password || !comment) {
      alert("닉네임, 비밀번호, 댓글 내용을 모두 입력해주세요.");
      return;
    }

    const newComment = {
      nickname,
      password,
      content: comment,
      timestamp: Date.now(),
    };

    const commentsRef = ref(db, `comments/${id}`);
    const newCommentRef = push(commentsRef); // 고유 ID로 새 댓글 추가
    await set(newCommentRef, newComment);

    setNickname("");
    setPassword("");
    setComment("");

    alert("댓글이 추가되었습니다!");
    // 댓글 목록 다시 가져오기
    setComments((prev) => [...prev, { id: newCommentRef.key, ...newComment }]);
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId, commentPassword) => {
    const userPassword = prompt("비밀번호를 입력해주세요.");
    if (userPassword === commentPassword) {
      const commentRef = ref(db, `comments/${id}/${commentId}`);
      await remove(commentRef);

      alert("댓글이 삭제되었습니다!");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  if (!post) {
    return <p>게시글을 불러오는 중이거나 존재하지 않습니다.</p>;
  };

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight: 'calc(100vh - 15rem)'}}>
      <div style={{width:'95%'}}>

        {/* 게시글 헤더 */}
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', margin:'0 0 0.2rem 0'}}>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
            <CategoryIcon alt="folder" src={`${process.env.PUBLIC_URL}/img/folder.png`}/>
            <Category>{post.category}</Category>
          </div>
          {currentUser ? //로그인 된 경우에만 게시글 첨삭버튼 출력
          <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Button_ED onClick={handleEdit}>수정</Button_ED>
            <div style={{backgroundColor:'black', width:'0.05rem', height:'80%', margin:'0 0.2rem 0 0.2rem'}}> </div>
            <Button_ED onClick={handleDelete} style={{ color: "red" }}>삭제</Button_ED>
          </div>
          :
          '' }
        </div>
        <Title>{post.title}</Title>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <Time style={{}}>작성: {post.uploadTime} &nbsp; &nbsp;</Time>
          {post.editTime && <Time>수정: {post.editTime}</Time>}
        </div>
        <HR />

        {/* 게시글 내용 */}
        {/* <PostContent>{post.content}</PostContent> */}
        <PostContent>
          <ReactMarkdown children={post.content} remarkPlugins={[remarkGfm]} />
        </PostContent>
        
        {/* 게시글 마무리 부분 */}
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', marginTop:'4rem'}}>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', margin:'0'}}>
            <TailText>Posted By</TailText>
            <TailText style={{backgroundColor:'white', color: 'gray'}}>콘스</TailText>
          </div>
          <VisitorText>조회수: {post.views}</VisitorText>
        </div>

        <hr style={{marginTop:'0.2rem'}}/>

        {/* 이전글, 다음글 버튼 */}
        <div style={{display:'flex', flexDirection:'column', width:'100%', textAlign:'left', marginTop: '1rem'}}>

          <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
            <CommentContainerIcon alt="page" src={`${process.env.PUBLIC_URL}/img/page.png`} style={{}}/>
            <TailTitle>다른 글 둘러보기</TailTitle>
          </div>

          <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
          {previousPost ? (
            <MovePostButton onClick={() => navigate(`/list/${previousPost.id}`, { state: { sortedPosts } })} style={{borderRight:'0'}}>
              <p style={{margin: '0', fontSize:'0.8rem', color:'gray'}}>이전 글</p>
              <MovePostText>{previousPost.title}</MovePostText>
            </MovePostButton>
          )
          :
          (<NoneDiv>
            <p>이전 글이 없습니다.</p>
          </NoneDiv>
          )}
          {nextPost ? (
            <MovePostButton onClick={() => navigate(`/list/${nextPost.id}`, { state: { sortedPosts } })}>
              <p style={{margin: '0', fontSize:'0.8rem', color:'gray'}}>다음 글</p>
              <MovePostText>{nextPost.title}</MovePostText>
            </MovePostButton>
          )
          :
          (<NoneDiv>
            <p style={{margin:'0 0 0 0'}}>다음 글이 없습니다.</p>
          </NoneDiv>
          )}
          </div>

        </div>
      
        {/* 댓글 */}
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', margin: '2rem 0 0 0'}}>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
            <CommentContainerIcon alt="comment" src={`${process.env.PUBLIC_URL}/img/comments.png`} />
            <TailTitle>댓글({comments.length})</TailTitle>
          </div>
          {/* <VisitorText>조회수: {post.views}</VisitorText> */}
        </div>
        
          {/* 댓글 목록 */}
          <CommentListContainer>

            {comments.map((c) => (
              <CommentContainer key={c.id}>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                  <CommentNickname>{c.nickname}</CommentNickname> {/* 댓글 닉네임 출력 */}
                  <CommentTime>{new Date(c.timestamp).toLocaleString()}</CommentTime> {/* 댓글 입력 시간 출력 */}
                  {currentUser && <CommentTime style={{color:'black'}}>| 비밀번호 : {c.password}</CommentTime>} {/* 로그인 된 경우 댓글 비밀번호 출력 */}
                  <div style={{margin:0, display:'flex', alignItems:'center', justifyContent:'flex-end', flex:1}}>
                    <CommentDeletButton onClick={() => {handleDeleteComment(c.id, c.password)}}>X</CommentDeletButton> {/* 댓글 삭제버튼 출력 */}
                  </div>
                </div>
                <CommentContent>{c.content}</CommentContent>
              </CommentContainer>
            ))}

          </CommentListContainer>

          {/* 댓글 작성 */}
          <CommentWriteContainer>

            <div style={{display:'flex', flexDirection:'row', padding:'0.3rem 0 0.3rem 0'}}>
              <CommentIcon alt="person" src={`${process.env.PUBLIC_URL}/img/person.png`} />
              <NicknameInput
                type="text"
                placeholder="댓글 닉네임"
                value={nickname}
                style={{width:'10rem'}}
                maxLength={10}
                onChange={(e) => setNickname(e.target.value)}
              />

              <CommentIcon alt="lock" src={`${process.env.PUBLIC_URL}/img/lock.png`} />
              <NicknameInput
                type="password"
                placeholder="댓글 비밀번호"
                value={password}
                style={{width:'7rem'}}
                maxLength={7}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
              <CommentTextArea
                placeholder="댓글을 작성해주세요."
                spellCheck="false"
                value={comment}
                maxLength={500}
                onChange={(e) => setComment(e.target.value)}
              />
              <CommentButton onClick={handleAddComment}>댓글 작성</CommentButton>
            </div>

          </CommentWriteContainer>

        </div>

      {/* <div>
        <h3>미리보기</h3>
        <ReactMarkdown children={post.content} remarkPlugins={[remarkGfm]} />
      </div> */}

      </div>
  );
};

export default Detail;

const Category = styled.p`
  // background-color: skyblue;
  text-align: left;
  margin: 0 0 0 -0.1rem;
  font-size: 1.2rem;
  color: #606060;
  font-weight: 600;

  font-family: "Song Myung", serif;
  font-style: normal;

  @media (max-width: 1024px) {
    font-size: 1rem;
  }
`

const CategoryIcon = styled.img`
  filter: opacity(0.6);
  width: 1.4rem;
  height: 1.4rem;
  margin-right: 0.2rem;

  @media (max-width: 1024px) {
    width: 1rem;
    height: 1rem;
  }
`;

const Title = styled.p`
  font-weight: bold;
  margin: 0.2rem 0.2rem 0.2rem -0.2rem; 
  text-align: left;
  font-size: 1.5rem;

  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }
`;

const HR = styled.hr`
  height : 0.2rem;
  background-color : gray;
  border : 0;
`;

const Time = styled.p`
  display: flex;
  // flex-direction: row;
  // text-align: left;
  margin: 0.4rem 0.4rem 0 0; 
  color: gray; 
  font-weight: 600;
  font-size: 1rem;
  @media (max-width: 1024px) and (min-width: 501px) {
    font-size: 0.8rem;
  }
  @media (max-width: 500px) {
    font-size: 0.6rem;
  }
`;

const Button_ED = styled.button`
  border: 0px;
  margin: 0 0.3rem 0 0.3rem;
  cursor: pointer;
  font-size: 0.9rem;
  height: 100%;
  padding: 0rem 0.5rem 0rem 0.5rem;
  background-color: white;

  &:hover {
  // text-decoration: underline;
  background-color: lightgray;
  }

  @media (max-width: 1024px) {
    font-size: 0.7rem;
  }
`;

const PostContent = styled.p`
  font-size: 1.2rem;
  text-align: left;

  font-family: "Noto Sans KR", serif;
  font-style: normal;

  img {
    max-width: 100%; /* 이미지가 화면 폭에 맞게 조정 */
    height: auto;   /* 이미지 비율 유지 */
  }

  @media (max-width: 1024px) {
    font-size: 1rem;
  }
`;

const NoneDiv = styled.div`
  width: 50%;
  border: 1px solid black;
  background-color: white;
  padding: 0.7rem;

  color: gray;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
`;

const MovePostButton = styled.button`
  width: 50%;
  cursor: pointer;
  border: 1px solid black;
  background-color: white;
  padding: 0.7rem;

  &:hover {
  background-color: lightgray;
  }
`;

const MovePostText = styled.p`
  margin: 0.2rem 0 0 0;
  color: #2A408E;
  font-size: 1.2rem;

  display: -webkit-box; /* 웹킷 브라우저 호환성 */
  -webkit-line-clamp: 1; /* 최대 1줄 표시 */
  -webkit-box-orient: vertical; /* 텍스트 방향 설정 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* 넘칠 경우 생략 표시 */

  @media (max-width: 1024px) {
    font-size: 1rem;
  }
`;

const CommentContainerIcon = styled.img`
  filter: opacity(0.8);
  width: 1.8rem;
  height: 1.9rem;
  margin: 0.2rem 0.2rem 0.4rem 0;

  @media (max-width: 1024px) {
    width: 1.4rem;
    height: 1.5rem;
  }
`;

const TailText = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  background-color: gray;
  color: white;
  padding: 0rem 0.5rem 0.2rem 0.5rem;
  border-radius: 10px;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 0.6rem;
  }
`

const TailTitle = styled.p`
  margin: 0 0 0.2rem 0;
  font-size: 1.7rem;

  font-family: "Yeon Sung", serif;
  font-weight: 500;
  font-style: normal;

  @media (max-width: 1024px) {
    font-size: 1.5rem;
  }
`;

const VisitorText = styled.p`
  margin: 0.3rem 0 0 0;
  font-size: 0.8rem;
  font-weight: bold;
  color: gray;

  @media (max-width: 1024px) {
    font-size: 0.6rem;
  }
`;

const CommentListContainer = styled.div`
  width: 100%;
  border: 1px solid black;
  border-radius: 15px;
  margin: 0 0 1rem 0;
`

const CommentContainer = styled.div`
  border-bottom: 2px solid lightgray;
  padding: 0 0 0.2rem 0;
  margin: 1rem;
`;

const CommentNickname = styled.p`
  margin: 0rem 0.5rem 0.2rem 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;

  @media (max-width: 1024px) {
    margin: 0rem 0.3rem 0.2rem 0.5rem;
    font-size: 1rem;
  }
`;

const CommentTime = styled.p`
  margin: 0.2rem 0.2rem 0.2rem 0.5rem;
  color: gray;
  font-size: 0.8rem;

  font-family: "Noto Sans KR", serif;
  font-weight: bold;

  @media (max-width: 1024px) {
    margin: 0.2rem 0.1rem 0.2rem 0.3rem;
    font-size: 0.5rem;
  }
`;

const CommentDeletButton = styled.button`
  border: 0px;
  color: red;
  margin: 0;
  background-color: white;
  cursor: pointer;
  font-size: 0.9rem;

  @media (max-width: 1024px) {
    font-size: 0.7rem;
  }
`;

const CommentContent = styled.p`
  display: flex;
  flex-direction: row;
  text-align: left;
  margin: 0.2rem 0.5rem 0.2rem 0.5rem;
  font-size: 1rem;
  border-left: 2px solid gray;
  padding: 0 0 0 0.7rem;
  
  font-family: "Noto Sans KR", serif;
  font-optical-sizing: auto;
  font-style: normal;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
    padding: 0 0 0 0.4rem;
  }
`;

const CommentWriteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 0 2rem 0;
`

const NicknameInput = styled.input`
  font-size: 1rem;
  color: #222222;
  width: 10rem;
  border: none;
  border-bottom: solid #aaaaaa 1px;
  padding-bottom: 0.2rem;
  padding-left: 0.2rem;
  background: none;
  margin: 0 1rem 0 0;
  font-weight: bold;

  &:focus { 
    outline: none; 
  }

  @media (max-width: 1024px) {
    font-size: 0.8rem;
    width: 8rem;
  }
`;

const CommentTextArea = styled.textarea`
  width: 99%;
  height: 3rem;
  resize: none;
  font-size: 1rem;
  border: 1px solid gray;
  border-radius: 10px;
  outline: none;
  background-color: #F3F3F3;
  color: black;
  margin: 0.5rem 0.4rem 0.5rem 0;
  padding: 0.5rem 0 0.5rem 0.3rem;

  font-family: "Noto Sans KR", serif;
  font-weight: <weight>;

  &::placeholder { /* placeholder 스타일 */
    color: #919797; /* 원하는 색상으로 변경 */
    font-weight: bold;
    font-size: 0.9rem;
  }

  @media (max-width: 1024px) {
    margin: 0.5rem 0 0.5rem 0;
    font-size: 0.8rem;
  }
`;

const CommentIcon = styled.img`
  filter: opacity(0.6);
  width: 1.8rem;
  height: 1.8rem;
  margin-bottom: 0.1rem;

  @media (max-width: 1024px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const CommentButton = styled.button`
  background-color: skyblue;
  border: 0px;
  width: 6rem;
  height: 2.2rem;
  cursor: pointer;
  color: black;
  border-radius: 8px;
  font-size: 0.9rem;
  margin: 0 0.5rem 0.5rem 0;

  font-family: "Noto Sans KR", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: 600;

  &:hover {
  background-color: #7cc6e3;
  }
`;