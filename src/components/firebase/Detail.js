import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const db = getDatabase(); // Realtime Database 사용
  const { currentUser } = useContext(AuthContext); // 현재 사용자 정보 가져오기

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

    const fetchComments = async () => {
      const commentsRef = ref(db, `comments/${id}`); // 게시글에 연결된 댓글
      const snapshot = await get(commentsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setComments(Object.entries(data).map(([key, value]) => ({ id: key, ...value })));
      }
    };

    fetchPost();
    fetchComments();
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
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <div style={{width:'90%'}}>

        {/* 게시글 헤더 */}
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', margin:'0.8rem 0 0.2rem 0'}}>
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
        <hr />

        {/* 게시글 내용 */}
        {/* <PostContent>{post.content}</PostContent> */}
        <PostContent>
          <ReactMarkdown children={post.content} remarkPlugins={[remarkGfm]} />
        </PostContent>

        <hr />
        
        {/* 댓글 */}
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:'1.5rem', marginBottom:'0.5rem'}}>
          <CommentContainerIcon alt="comment" src={`${process.env.PUBLIC_URL}/img/comments.png`} />
          <p style={{textAlign:'left', margin:0, fontSize:'1.5rem'}}>댓글({comments.length})</p>
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
`

const CategoryIcon = styled.img`
  filter: opacity(0.6);
  width: 1.4rem;
  height: 1.4rem;
  margin-right: 0.2rem;
`;

const Title = styled.p`
  font-weight: bold;
  margin: 0.2rem 0.2rem 0.2rem -0.2rem; 
  text-align: left;
  font-size: 1.5rem;
`;

const Time = styled.p`
  display: flex;
  // flex-direction: row;
  // text-align: left;
  margin: 0.8rem 0.4rem 0.4rem 0; 
  color: gray; 
  font-weight: 600;
  font-size: 1rem;
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
`;

const PostContent = styled.p`
  font-size: 1.2rem;
  text-align: left;
`;

const CommentContainerIcon = styled.img`
  filter: opacity(0.8);
  width: 2rem;
  height: 2.1rem;
  margin: 0.2rem 0.2rem 0 0.3rem;
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
`;

const CommentTime = styled.p`
  margin: 0.2rem 0.2rem 0.2rem 0.5rem;
  color: gray;
  font-size: 0.8rem;
`;

const CommentDeletButton = styled.button`
  border: 0px;
  color: red;
  margin: 0;
  background-color: white;
  cursor: pointer;
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

  &:focus { 
  outline: none; 
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
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 0.5rem 0 0.5rem 0.3rem;

  &::placeholder { /* placeholder 스타일 */
    color: #919797; /* 원하는 색상으로 변경 */
    font-weight: bold;
    font-size: 0.9rem;
  }
`;

const CommentIcon = styled.img`
  filter: opacity(0.6);
  width: 1.8rem;
  height: 1.8rem;
  margin-bottom: 0.1rem;
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