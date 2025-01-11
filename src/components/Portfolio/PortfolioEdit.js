import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../firebase/AuthContext ";
import styled from "styled-components";

const PortfolioEdit = () => {
//   const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [short, setShort] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Portfolio");
  const [file, setFile] = useState(null);

  const db = getDatabase();
  const storage = getStorage();
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const id = location.state?.id || '없음';

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = ref(db, "Portfolio/" + id);
      const snapshot = await get(postRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPost(data);
        setTitle(data.title);
        setShort(data.short);
        setProjectDate(data.projectDate);
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
      short,
      content,
      category,
      fileURL: fileURL || null,
      updatedAt: Date.now(),
      editTime: new Date().toLocaleString(),
      projectDate,
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
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <Title>포트폴리오 수정</Title>
      <hr style={{width:'90%'}}/>
      {currentUser ?
      <form onSubmit={handleSubmit} style={{width:'90%'}}>

        <CustomDiv>
          <SmallTitle>카테고리</SmallTitle>
          <CategorySelect value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Portfolio">포트폴리오</option>
          </CategorySelect>
        </CustomDiv>

        <CustomDiv>
          <SmallTitle>제목</SmallTitle>
          <TitleInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </CustomDiv>

        <CustomDiv>
          <SmallTitle>요약 설명</SmallTitle>
          <TitleInput
            type="text"
            value={short}
            onChange={(e) => setShort(e.target.value)}
            placeholder="포트폴리오 요약 설명"
            required
          />
        </CustomDiv>

        <CustomDiv>
          <SmallTitle>프로젝트 날짜</SmallTitle>
          <TitleInput
            type="text"
            value={projectDate}
            onChange={(e) => setProjectDate(e.target.value)}
            placeholder="포트폴리오 작업 날짜(ex. 2024.12 / 2024.12 - 2025.02)"
            required
          />
        </CustomDiv>
        
        <CustomDiv>
          <SmallTitle>내용</SmallTitle>
          <ContentTextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </CustomDiv>

        <CustomDiv>
          <SmallTitle>파일첨부</SmallTitle>
          <FileInput type="file" onChange={(e) => setFile(e.target.files[0])} />
        </CustomDiv>
        {post.fileURL && (
          <div>
            <p>현재 파일: <a href={post.fileURL} target="_blank" rel="noopener noreferrer">첨부파일 보기</a></p>
          </div>
        )}
        <CustomDiv style={{alignItems:'flex-end'}}>
          <PostButton type="submit">게시글 수정</PostButton>
        </CustomDiv>
      </form>
      :
      <div>
        <h3 style={{color: 'red'}}>! 포트폴리오 수정에는 로그인이 필요합니다 !</h3>
      </div>
      }
    </div>
  );
};

export default PortfolioEdit;

const CustomDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CategorySelect = styled.select`
  margin: 0.5rem 0 0 0.5rem;
  width: 10rem;
  height: 1.5rem;
`;

const Title = styled.p`
  font-family: "Yeon Sung", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 2.5rem;
  margin: 1rem 0 0.5rem 0;
`;

const SmallTitle = styled.p`
  font-family: "Yeon Sung", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 1.5rem;
  margin: 1rem 0 0 0.5rem;
`;

const TitleInput = styled.input`
  margin: 0.5rem 0 0 0.5rem;
  width: calc(100% - 1.5rem);
  height: 1.5rem;
  // background-color: lightgray;
`;

const ContentTextArea = styled.textarea`
  resize: none;
  margin: 0.5rem 0 0 0.5rem;
  width: calc(100% - 1.5rem);
  height: 20rem;
`;

const FileInput = styled.input`
  margin: 0.5rem 0 0 0.5rem;
  width: calc(100% - 1.5rem);
  // height: 1.5rem;
`;

const PostButton = styled.button`
  background-color: skyblue;
  border: 0px;
  width: 6rem;
  height: 2.2rem;
  cursor: pointer;
  color: black;
  border-radius: 8px;
  font-size: 0.9rem;
  margin: 0 1rem 0 0;

  font-family: "Noto Sans KR", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: 600;

  &:hover {
  background-color: #7cc6e3;
  }
`;