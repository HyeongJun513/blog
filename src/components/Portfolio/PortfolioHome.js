import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
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
    padding: "20px",
    borderRadius: "10px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경 흐림 효과
  },
};

const PortfolioHome = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

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
      const stripMarkdown = (markdown) => { //미리보기에 마크다운 코드 제거 함수
        const html = marked.parse(markdown); //Markdown 텍스트를 HTML 문자열로 변환
        const tempDiv = document.createElement("div"); //임시 div엘리먼트 생성.
        tempDiv.innerHTML = html; //임시 div 엘리먼트 내부에 변환된 HTML 삽입
        return tempDiv.textContent || tempDiv.innerText || ""; //임시 div 엘리먼트 내부에 존재하는 텍스트만 추출 //textContent가 작동하지 않는 브라우저인 경우 innerText 사용, 그도 안되면 그냥 공백값 반환
      }; //textContent: HTML 태그를 무시하고 모든 텍스트를 반환. //innerText: 화면에 보이는 텍스트만 반환 (<h4 style="display:none">숨겨진 제목</h4> 인 경우 반환하지 않음).

      const previewText = stripMarkdown(post.content);

      return ( //navigate(`/list/${post.id}` 
        <div style={{display:'flex', flexDirection:'column'}}>
  
          {/* <ListButton onClick={() => openPostDetails(post)} > */}
          <ListButton onClick={() => openModal(post)} >
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

    return (
        <div style={{marginTop:'1rem', display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{width:'90%'}}>

                <IntroduceContainer>
                    <div style={{borderBottom:'1px solid black', width:'90%'}}>
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

                <ProjectContainer>
                  <div style={{borderBottom:'1px solid black', width:'90%', marginTop:'3rem'}}>
                      <Title>Projects</Title>
                  </div>
                  {portfolio.map((project) => (
                    <div key={project.id} style={{width:'90%'}}>
                      {printList(project)}
                      
                      {/* Modal 컴포넌트 */}
                      <ReactModal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Portfolio Details"
                      >
                        <h1>{selectedPost?.title}</h1>
                        <ReactMarkdown>{selectedPost?.content}</ReactMarkdown>
                        <button onClick={closeModal}>닫기</button>
                      </ReactModal>
                    </div>
                  ))}
                </ProjectContainer>
            </div>
        </div>
    );
};

export default PortfolioHome;


const ProfileImg = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  margin: 1rem 0 0 0;
`;

const Title = styled.p`
  font-weight: bold;
  margin: 0 0 0.3rem 0;
  font-size: 2rem;
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

const ProjectContainer = styled.div`
  display: flex;
  flex-direction : column;
  align-items: center;
`;

const ProjectButton = styled.div`

`;


//=================================================
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