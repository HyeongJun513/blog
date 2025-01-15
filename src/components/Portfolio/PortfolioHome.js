import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { AuthContext } from "../firebase/AuthContext ";
import { marked } from "marked"; //markdown을 html 방식으로 변환하는 모듈
import styled from "styled-components";
import ReactModal from "react-modal";
import ReactMarkdown from "react-markdown";

// Modal의 스타일을 정의
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)", // 화면 중앙 정렬
    width: "40vw", // 창 크기
    height: "90vh",
    padding: "0px",
    borderRadius: "10px",
    overflow: "hidden", // 스크롤바가 모달 경계를 넘지 않도록 설정
    zIndex: 3, // Header 출력 방지
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경 흐림 효과
    zIndex: 2, // Header 출력 방지
  },
};

const PortfolioHome = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext); //로그인 사용자 판별

    const openModal = (post) => {
      setSelectedPost(post);
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
      setSelectedPost(null);
    };
  
    useEffect(() => {
      const db = getDatabase();
      const portfolioRef = ref(db, "Portfolio");
  
      const unsubscribe = onValue(portfolioRef, (snapshot) => {
        const data = snapshot.val();
        console.log('data : ', data)
        const portfolioArray = data
          ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          : [];
          setPortfolio(portfolioArray.reverse()); //데이터 역순 (최신 데이터 위로, 과거 데이터 아래로로)
      });
  
      return () => unsubscribe();
    }, []);

    const printList = (post) => {

      return (
        <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
          <ProjectSmallContainer onClick={() => openModal(post)}>
            <ProjectImg alt="CoverImg" src={`${post.coverImg}`}/>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'1rem'}}>
              <div>
                <ProjectTitle style={{fontSize: '1.5rem'}}>{post.title}</ProjectTitle>
                <ProjectInfo style={{ fontSize:'0.9rem' }}>
                  <ProjectInfoIcon alt="date" src={`${process.env.PUBLIC_URL}/img/date.png`}/> {post.projectDate} &nbsp;&nbsp;&nbsp;
                  <ProjectInfoIcon alt="person" src={`${process.env.PUBLIC_URL}/img/person.png`}/> {post.personNum}
                </ProjectInfo>
              </div>
              <ProjectContent>
                <p style={{ margin: 0, fontSize: '1rem' }}>{post.short}</p>
              </ProjectContent>
              <ProjectInfo style={{ fontSize:'0.9rem' }}>
                <ProjectInfoIcon alt="folder" src={`${process.env.PUBLIC_URL}/img/tag.png`}/> {post.skils}
              </ProjectInfo>
            </div>
          </ProjectSmallContainer>
        </div>
      );
    };

    const Introduce = (alt, Title, Text) => {
        const PrintIntroduceIcon = (alt) =>{
            if (alt === 'person') return <IntroduceIcon alt="person" src={`${process.env.PUBLIC_URL}/img/person.png`}/>;
            else if (alt === 'birth') return <IntroduceIcon alt="birth" src={`${process.env.PUBLIC_URL}/img/date.png`}/>;
            else if (alt === 'education') return <IntroduceIcon alt="education" src={`${process.env.PUBLIC_URL}/img/education.png`}/>;
            else if (alt === 'email') return <IntroduceIcon alt="email" src={`${process.env.PUBLIC_URL}/img/mail.png`}/>;
            else if (alt === 'location') return <IntroduceIcon alt="location" src={`${process.env.PUBLIC_URL}/img/location.png`}/>;
            else if (alt === 'github') return <IntroduceIcon alt="github" src={`${process.env.PUBLIC_URL}/img/github.png`}/>;
            else return <p>Img Error!</p>;
        };

        return (
            <IntroduceDiv>
                {PrintIntroduceIcon(alt)}
                <div style={{width:'100%'}}>
                    <IntroduceTitle>{Title}</IntroduceTitle>
                    {alt === 'github' ? 
                    <GithubButton onClick={() => {window.open("https://github.com/HyeongJun513", "_blank");}}>GITHUB</GithubButton>
                    :
                    <IntroduceText>{Text}</IntroduceText>
                    }
                </div>
            </IntroduceDiv>
        );
    };

  // 게시글 수정 함수
  const handleEdit = (id) => {
    navigate(`/portfolio/edit`, {state : {id: id}}); // 수정 페이지로 이동
  };

    return (
        <Container>
            <div style={{width:'95%', padding:'0 0 1rem 0'}}>

                <IntroduceContainer>
                    <div style={{borderBottom:'1px solid black', width:'100%'}}>
                        <Title>About me</Title>
                    </div>
                    <ProfileImg alt="Profile" src={`${process.env.PUBLIC_URL}/img/Profile.png`}/>
                    <DescriptionText>안녕하세요. 신입 개발자 박형준입니다.</DescriptionText>
                    <div style={{display:'flex', flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
                    {Introduce('person','이름','박형준')}
                    {Introduce('birth','생일','00.05.13')}
                    {Introduce('education','학력','백석대 컴퓨터공학부')}
                    </div>
                    <div style={{display:'flex', flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
                    {Introduce('email','이메일','parkhj625@gmail.com')}
                    {Introduce('location','거주','서울 송파구')}
                    {Introduce('github','깃허브','링크')}
                    </div>
                </IntroduceContainer>

                <SkilContainer>
                    <div style={{borderBottom:'1px solid black', width:'100%', margin:'3rem 0 1rem 0'}}>
                        <Title>Skils</Title>
                    </div>
                    <div style={{display:'flex', flexDirection:'row'}}>
                      <SkilSmallContainer>
                        <SkilTitle>Frontend</SkilTitle>
                        
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                          <SkilDiv1><SkilIcon1 alt="HTML" src={`${process.env.PUBLIC_URL}/img/HTML.png`}></SkilIcon1></SkilDiv1>
                          <SkilDiv1><SkilIcon1 alt="JS" src={`${process.env.PUBLIC_URL}/img/JS.png`}></SkilIcon1></SkilDiv1>
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                          <SkilDiv1><SkilIcon1 alt="HTML" src={`${process.env.PUBLIC_URL}/img/Styled-Components.png`}></SkilIcon1></SkilDiv1>
                          <SkilDiv1><SkilIcon1 alt="JS" src={`${process.env.PUBLIC_URL}/img/Materialize.png`}></SkilIcon1></SkilDiv1>
                        </div>
                        <SkilDiv2><SkilIcon2 alt="React" src={`${process.env.PUBLIC_URL}/img/React.png`}></SkilIcon2></SkilDiv2>
                      </SkilSmallContainer>
                      <div>
                      <SkilSmallContainer>
                        <SkilTitle>Backend</SkilTitle>
                        <SkilDiv2><SkilIcon2 alt="React" src={`${process.env.PUBLIC_URL}/img/Firebase.png`}></SkilIcon2></SkilDiv2>
                      </SkilSmallContainer>
                      <SkilSmallContainer>
                        <SkilTitle>Mobile</SkilTitle>
                        <SkilDiv2><SkilIcon2 alt="React" src={`${process.env.PUBLIC_URL}/img/React-Native.png`}></SkilIcon2></SkilDiv2>
                        <SkilDiv2><SkilIcon2 alt="React" src={`${process.env.PUBLIC_URL}/img/Expo.png`}></SkilIcon2></SkilDiv2>
                      </SkilSmallContainer>
                      </div>
                    </div>
                </SkilContainer>

                <ProjectContainer>
                  <div style={{borderBottom:'1px solid black', width:'100%', margin:'3rem 0 1rem 0'}}>
                      <Title>Projects</Title>
                  </div>
                  {portfolio.map((project) => (
                    <div key={project.id} style={{width:'100%'}}>
                      {printList(project)}

                      {/* Modal 컴포넌트 */}
                      <ReactModal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Portfolio Details"
                      >
                        <ModalHeader>
                          <div style={{display:'flex', alignItems:'center'}}>
                            <ModalHeaderTitle>프로젝트 소개</ModalHeaderTitle>
                          </div>
                          <div style={{display:'flex', alignItems:'center'}}>
                          {currentUser && <ModalEditButton onClick={() => handleEdit(selectedPost.id)}>포트폴리오 수정</ModalEditButton>}
                          <ModalCloseButton onClick={closeModal}>X</ModalCloseButton>
                          </div>
                        </ModalHeader>
                        
                        <ModalContent>
                          <ModalContentTitle>{selectedPost?.title}</ModalContentTitle>
                          <ModalContentInfo>
                          <ProjectInfoIcon alt="date" src={`${process.env.PUBLIC_URL}/img/date.png`}/>{selectedPost?.projectDate} &nbsp;
                          |
                          &nbsp; <ProjectInfoIcon alt="person" src={`${process.env.PUBLIC_URL}/img/person.png`}/>{selectedPost?.personNum}</ModalContentInfo>
                          <hr />
                          <ReactMarkdown>{selectedPost?.content}</ReactMarkdown>
                        </ModalContent>

                      </ReactModal>
                    </div>
                  ))}
                </ProjectContainer>
            </div>
        </Container>
    );
};

export default PortfolioHome;


const Container = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 15rem;
  height: 15rem;
  border-radius: 50%;
  margin: 1rem 0 0 0;
`;

const Title = styled.p`
  font-weight: bold;
  margin: 0 0 0.3rem 0;
  font-size: 2.5rem;
`;

const IntroduceContainer = styled.div`
  display: flex;
  flex-direction : column;
  align-items: center;
`;

const DescriptionText = styled.div`
  background-color: lightgray;
  color: gray; 
  width: 60%; 
  text-align: center;
  padding: 0.7rem;

  font-family: "Nanum Pen Script", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 1.5rem;
  margin: 0.5rem 0 0.5rem 0;
`;

const IntroduceDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 12rem;
  margin: 1.5rem 1.5rem 0 1.5rem;
`;

const IntroduceIcon = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 0.5rem;
`;

const IntroduceTitle = styled.p`
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0.2rem;
  text-align: left;
`;

const IntroduceText = styled.p`
  font-size: 0.8rem;
  color: gray;
  margin: 0.2rem;
  text-align: left;
`;

const GithubButton = styled.p`
  font-size: 0.8rem;
  font-weight: bold;
  color: gray;
  border: 0px;
  text-align: left;
  cursor: pointer;
  margin: 0.2rem;

  &:hover {
  text-decoration: underline;
  color: gray;
  }
`;

const SkilContainer = styled.div`
  display: flex;
  flex-direction : column;
  align-items: center;
`;

const SkilSmallContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid gray;
  border-radius: 5px;
  margin: 0.5rem 1rem 0.5rem 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
`;

const SkilTitle = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0.3rem 0.2rem 0.5rem 0.2rem;
  border-bottom: 2px solid gray;
  width: 80%;
`;

const SkilDiv1 = styled.div`
  width: 7rem;
  height: 7rem;
  border: 2px solid lightgray;
  padding: 0.3rem;
  margin: 0.4rem 0.5rem 0.4rem 0.5rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  transition: transform 0.5s ease, box-shadow 0.5s ease; /* 0.5초 동안 확대 애니메이션 */
  &:hover {
    transform: scale(1.1); /* 중앙 기준 10% 확대 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* 그림자 효과 */
  }
`;

const SkilDiv2 = styled.div`
  width: 16rem;
  height: 5.5rem;
  border: 2px solid lightgray;
  padding: 0.3rem;
  margin: 0.4rem 0.3rem 0.4rem 0.3rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  transition: transform 0.5s ease, box-shadow 0.5s ease; /* 0.5초 동안 확대 애니메이션 */
  &:hover {
    transform: scale(1.1); /* 중앙 기준 10% 확대 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* 그림자 효과 */
  }
`;

const SkilIcon1 = styled.img`
  width: 5rem;
  height: 5rem;
  object-fit: contain; /* cover: 이미지 초과되는 부분 자름 / contain : 초과되는 부분 없이 왜곡시켜 이미지 전부 표시 */
  object-position: center; /* 이미지를 가운데 정렬 */
  min-width: 5rem;
  min-height: 5rem;
  margin: 0.2rem;
`;

const SkilIcon2 = styled.img`
  width: 11rem;
  height: 5rem;
  object-fit: contain; /* cover: 이미지 초과되는 부분 자름 / contain : 초과되는 부분 없이 왜곡시켜 이미지 전부 표시 */
  object-position: center; /* 이미지를 가운데 정렬 */
  min-width: 11rem;
  min-height: 5rem;
  margin: 0.2rem;
`;

const ProjectContainer = styled.div`
  display: flex;
  flex-direction : column;
  align-items: center;

  flex-wrap: wrap; /* 줄바꿈 허용 */
  justify-content: space-evenly; /* 아이템 간격 균등 배치 */
  gap: 1rem; /* 아이템 간의 간격 */
  margin: 0 auto; /* 중앙 정렬 */
  max-width: 1200px; /* 최대 너비 설정 */
`;

const ProjectSmallContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  border-radius: 15px;
  margin: 0.5rem 0;
  width: 90%;
  cursor: pointer;
  transition: transform 0.5s ease, box-shadow 0.5s ease; /* 0.5초 동안 확대 애니메이션 */
  overflow: hidden;

  &:hover {
    transform: scale(1.05); /* 중앙 기준 5% 확대 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* 그림자 효과 */
  }
`;

const ProjectImg = styled.img`
  width: 18rem;
  height: 12rem;
  object-fit: cover; /* cover: 이미지 초과되는 부분 자름 / contain : 초과되는 부분 없이 왜곡시켜 이미지 전부 표시 */
  object-position: center; /* 이미지를 가운데 정렬 */
  min-width: 18rem;
  min-height: 12rem;
`;

const ProjectTitle = styled.div`
  font-weight: bold;
  margin: 0 0 0.3rem 0;
  font-size: 2rem;
  color: #2A408E;
`;

const ProjectContent = styled.div`
  // display: -webkit-box; /* 웹킷 브라우저 호환성 */
  // -webkit-line-clamp: 2; /* 최대 2줄 표시 */
  // -webkit-box-orient: vertical; /* 텍스트 방향 설정 */
  // overflow: hidden; /* 넘치는 텍스트 숨김 */
  // text-overflow: ellipsis; /* 넘칠 경우 생략 표시 */

  text-align: center;
  margin: 0.3rem 0 0.3rem 0.2rem;
`;

const ProjectInfo = styled.p`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin:  0.1rem 0 0 0.2rem; 
  color: gray; 
  font-weight: bold;
  // background-color: skyblue;
`;

const ProjectInfoIcon = styled.img`
  filter: opacity(0.6);
  width: 1.2rem;
  height: 1.2rem;
  margin: 0.4rem 0.1rem 0.4rem 0;
`;

const ModalHeaderTitle = styled.p`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: gray;
  width: 100%;
  height: 3.5rem;
  margin: 0 0 0 0;
`;

const ModalContent = styled.div`
  height: calc(90vh - 5rem); /* 헤더와의 간격을 고려 */
  overflow-y: auto; /* 수직 스크롤 활성화 */
  padding: 1rem;

  /* 스크롤바 스타일 */
  ::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
  }

  ::-webkit-scrollbar-thumb {
    background: #888; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 둥글게 */
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* 호버 시 스크롤바 색상 */
  }

  ::-webkit-scrollbar-track {
    background: transparent; /* 스크롤바 배경 투명 */
  }
`;

const ModalCloseButton = styled.button`
  background-color: gray;
  color: white;
  border-radius: 15px;
  margin: 0.5rem;
  font-size: 1.8rem;
  font-weight: bold;
  border: 0px;
  cursor: pointer;

  &:hover {
    color: lightgray;
  }
`;

const ModalEditButton = styled.button`
  background-color: gray;
  color: skyblue;
  margin: 0.7rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: 0px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ModalContentTitle = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin: 0.1rem 0 0.1rem 0;
`;

const ModalContentInfo = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: gray;
  margin: 0.2rem 0 0.2rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`