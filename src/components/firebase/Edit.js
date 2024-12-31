import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { AuthContext } from "./AuthContext ";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [file, setFile] = useState(null);

  const db = getDatabase();
  const storage = getStorage();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = ref(db, "posts/" + id);
      const snapshot = await get(postRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      } else {
        console.error("게시글을 찾을 수 없습니다.");
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    let fileURL = post?.fileURL; // 기존 파일 URL 유지

    if (file) {
      // 기존 파일이 있는 경우 삭제
      if (fileURL) {
        const oldFileRef = storageRef(storage, fileURL);
        await deleteObject(oldFileRef);
      }

      // 새 파일 업로드
      const newFileRef = storageRef(storage, `uploads/${file.name}`);
      await uploadBytes(newFileRef, file);
      fileURL = await getDownloadURL(newFileRef); // 새 파일 URL 갱신
    }

    const updatedPost = {
      title,
      content,
      category,
      fileURL: fileURL || null,
      updatedAt: Date.now(),
      editTime: new Date().toLocaleString(),
    };

    const postRef = ref(db, "posts/" + id);
    await update(postRef, updatedPost);

    alert("게시글이 수정되었습니다!");
    navigate(`/list/${id}`); // 수정 완료 후 해당 게시글로 이동
  };

  if (!post) {
    return <p>게시글을 불러오는 중입니다...</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>게시글 수정</h1>
      {currentUser ?
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            제목:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            내용:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            분류:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="general">일반</option>
              <option value="react">React</option>
              <option value="react-native">React Native</option>
              <option value="another">기타</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            파일 첨부 (새 파일을 선택하면 기존 파일이 삭제됩니다.):
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </label>
        </div>
        {post.fileURL && (
          <div>
            <p>현재 파일: <a href={post.fileURL} target="_blank" rel="noopener noreferrer">첨부파일 보기</a></p>
          </div>
        )}
        <button type="submit">수정 완료</button>
      </form>
      :
      <div>
        <h3 style={{color: 'red'}}>! 게시글 작성에는 로그인이 필요합니다 !</h3>
      </div>
      }
    </div>
  );
};

export default Edit;