import React, { useState, useContext } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext ";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";

const Post = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("일반");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(false);

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
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <Title>게시글 작성</Title>
      <hr style={{width:'90%'}}/>
      <form onSubmit={handleSubmit} style={{width:'90%'}}>

        <CustomDiv style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <div>
          <SmallTitle>카테고리</SmallTitle>
          <CategorySelect value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="일반">일반</option>
            <option value="React">React</option>
            <option value="React-Native">React Native</option>
            <option value="기타">기타</option>
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
            placeholder="제목 입력"
            required
          />
        </CustomDiv>

        <CustomDiv>
          <SmallTitle>내용</SmallTitle>
            <ContentTextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="MarkDown 문법으로 글을 작성하세요."
              required
            />
        </CustomDiv>

        <CustomDiv>
          <SmallTitle>파일 첨부</SmallTitle>
          <FileInput type="file" onChange={(e) => setFile(e.target.files[0])} />
        </CustomDiv>

        <CustomDiv style={{alignItems:'flex-end'}}>
          <PostButton type="submit">게시글 작성</PostButton>
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
      <h3 style={{color: 'red'}}>! 게시글 작성에는 로그인이 필요합니다 !</h3>
    </div>
  );
};

export default Post;

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
//style={{width:'90%', margin:'2rem 0 5rem 0.5rem'}}
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

const PreviewContent = styled.p`
  font-size: 1.2rem;
  text-align: left;
`;