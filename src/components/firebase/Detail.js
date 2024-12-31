import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, set, push, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { AuthContext } from "./AuthContext ";

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
    if (!nickname || !password || !comment) {
      alert("닉네임, 비밀번호, 댓글 내용을 모두 입력해주세요.");
      return;
    }

    const newComment = {
      nickname,
      password, // 비밀번호는 암호화가 필요할 수 있음 (기본 구현에서는 평문 저장)
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
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>업로드 시간 : {post.uploadTime}</p>
      {(post.editTime) && <p>수정시간 : {post.editTime}</p>}
      
      {post.fileURL && (
        <div>
          <a href={post.fileURL} target="_blank" rel="noopener noreferrer">
            첨부파일 보기
          </a>
        </div>
      )}

      <p>게시판: {post.category}</p>

      {/* 게시글 수정 및 삭제 버튼 */}
      {
        currentUser ? //로그인 된 경우에만 버튼 출력력
        <div>
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
            삭제
          </button>
        </div>
        :
        ''
      }
      <button onClick={() => {navigate('/list')}}> 목록 </button>

      {/* ====================================== */}
      <hr />
      <h2>댓글</h2>

      {/* 댓글 목록 */}
      <div>
        {comments.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <p>
              <strong>{c.nickname}</strong> ({new Date(c.timestamp).toLocaleString()})
            </p>
            <p>{c.content}</p>
            <button
              style={{ color: "red" }}
              onClick={() => handleDeleteComment(c.id, c.password)}
            >
              댓글 삭제
            </button>
          </div>
        ))}
      </div>

      {/* 댓글 작성 */}
      <div>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <textarea
          placeholder="댓글 내용을 입력하세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleAddComment}>댓글 추가</button>
      </div>

    </div>
  );
};

export default Detail;
