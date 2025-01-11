import React, { useState, useContext } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/AuthContext ";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";

const PortfolioPost = () => {
  const [title, setTitle] = useState("");
  const [short, setShort] = useState("");
  const [content, setContent] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [category, setCategory] = useState("Portfolio");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const [previewURL, setPreviewURL] = useState("");

  const { currentUser } = useContext(AuthContext); // 현재 사용자 정보 가져오기
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const db = getDatabase();
    const postsRef = ref(db, "Portfolio");
    const storage = getStorage();

    let fileURL = null;

    if (file) {
      const fileRef = storageRef(storage, `uploads/${file.name}`);
      await uploadBytes(fileRef, file);
      fileURL = await getDownloadURL(fileRef);
    };
    const newPost = {
      title,
      short,
      content,
      category,
      fileURL,
      createdAt: Date.now(),
      uploadTime : new Date().toLocaleString(),
      projectDate,
    };

    await push(postsRef, newPost);

    alert("게시글이 업로드되었습니다!");
    navigate("/portfolio"); // 포트폴리오 페이지로 이동
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      setFile(selectedFile);
  
      // Firebase Storage에 파일 업로드
      const storage = getStorage();
      const fileRef = storageRef(storage, `portfolio/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
  
      // 업로드된 파일의 URL 가져오기
      const url = await getDownloadURL(fileRef);
  
      // URL을 상태로 저장
      setPreviewURL((prevContent) => `${prevContent}\nURL : ${url}`);
      alert("파일이 업로드되었습니다! 본문에 삽입되었습니다.");
    }
  };
  

  return (
    currentUser ?
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <Title>포트폴리오 작성</Title>
      <hr style={{width:'90%'}}/>
      <form onSubmit={handleSubmit} style={{width:'90%'}}>

        <CustomDiv style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <div>
          <SmallTitle>카테고리</SmallTitle>
          <CategorySelect value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Portfolio">포트폴리오</option>
          </CategorySelect>
          </div>

          <div>
          <SmallTitle>미리보기</SmallTitle>
          <CheckboxInput
            type="checkbox"
            checked={preview}
            onChange={(e) => {setPreview(e.target.checked)}}
          />
          </div>
        </CustomDiv>

        <CustomDiv>
          <SmallTitle>제목</SmallTitle>
          <TitleInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="포트폴리오 제목"
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
              placeholder="MarkDown 문법으로 포트폴리오 소개"
              required
            />
        </CustomDiv>

        <CustomDiv>
          <SmallTitle>파일 첨부</SmallTitle>
          <div style={{display:'flex', width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <FileInput type="file" onChange={handleFileChange} />
          <PostButton type="submit">포트폴리오 작성</PostButton>
          </div>
        </CustomDiv>

        <SmallTitle style={{textAlign:'left'}}>첨부파일 링크</SmallTitle>
        <CustomDiv style={{backgroundColor:'lightgray', width:'calc(100% - 1.1rem)', margin:'0.5rem'}}>
          <FileLink>{previewURL}</FileLink>
        </CustomDiv>
      </form>

      {preview && 
      <PreviewContainer>
        <Title>미리보기</Title>
        <hr />
        <PreviewContent>
          <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
        </PreviewContent>
      </PreviewContainer>
      }
    </div>
    :
    <div>
      <h1>게시글 작성</h1>
      <h3 style={{color: 'red'}}>! 포트폴리오 작성에는 로그인이 필요합니다 !</h3>
    </div>
  );
};

export default PortfolioPost;

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

const CheckboxInput = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
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

const PreviewContainer = styled.div`
  width: calc(90% - 0.5rem);
  margin: 2rem 0 5rem 0.5rem;
`

const ContentTextArea = styled.textarea`
  resize: none;
  margin: 0.5rem 0 0 0.5rem;
  width: calc(100% - 1.5rem);
  height: 20rem;
`;

const FileLink = styled.p`
  margin: 0 0 0 0.3rem;
  font-size: 1rem;
`;

const FileInput = styled.input`
  margin: 0.5rem 0 0 0.5rem;
  width: calc(100% - 1.5rem);
  // height: 1.5rem;
`;

const PostButton = styled.button`
  background-color: skyblue;
  border: 0px;
  width: 10rem;
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

const PreviewContent = styled.p`
  font-size: 1.2rem;
  text-align: left;
`;