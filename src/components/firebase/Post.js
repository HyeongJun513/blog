import React, { useState, useContext } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext ";

const Post = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [file, setFile] = useState(null);

  const { currentUser } = useContext(AuthContext); // 현재 사용자 정보 가져오기
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const db = getDatabase();
    const postsRef = ref(db, "posts");
    const storage = getStorage();

    let fileURL = null;

    if (file) {
      const fileRef = storageRef(storage, `uploads/${file.name}`);
      await uploadBytes(fileRef, file);
      fileURL = await getDownloadURL(fileRef);
    };
    const newPost = {
      title,
      content,
      category,
      fileURL,
      createdAt: Date.now(),
      uploadTime : new Date().toLocaleString(),
      // editTime: 'None',
    };

    await push(postsRef, newPost);

    alert("게시글이 업로드되었습니다!");
    navigate("/list"); // 게시글 목록 페이지로 이동
  };

  return (
    currentUser ?
    <div>
      <h1>게시글 작성</h1>
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
              <option value="일반">일반</option>
              <option value="React">React</option>
              <option value="React-Native">React Native</option>
              <option value="기타">기타</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            파일 첨부:
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </label>
        </div>
        <button type="submit">업로드</button>
      </form>

    </div>
    :
    <div>
      <h1>게시글 작성</h1>
      <h3 style={{color: 'red'}}>! 게시글 작성에는 로그인이 필요합니다 !</h3>
    </div>
  );
};

export default Post;
