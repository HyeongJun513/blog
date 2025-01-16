import React from "react";
import styled from "styled-components";

const Profile = () => {
    return (
        <Container>
            <ProfileImg alt="Profile" src={`${process.env.PUBLIC_URL}/img/Profile.png`}/>
            <div style={{borderBottom:'2px solid lightgray', width:'90%', padding:'0.2rem 0 0.2rem 0'}}>
              <Nickname>코딩하는 콘스</Nickname>
              <Name>박형준 (Park Hyeong Jun)</Name>
            </div>
            
            <div style={{borderBottom:'2px solid lightgray', width:'90%', padding:'0.2rem 0 0.2rem 0'}}>
              <Introduce>안녕하세요. 반갑습니다.</Introduce>
            </div>
            {/* <div>
              <LinkButton onClick={() => {window.open("https://github.com/HyeongJun513", "_blank");}}>GitHUB</LinkButton>
              <LinkButton onClick={() => {window.open("https://hyeongjun513.github.io/blog/", "_blank");}}>Website</LinkButton>
            </div> */}
        </Container>
    );
};

export default Profile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0.7rem;
  margin: 0;
//   background-color: lightgray;
`;

const ProfileImg = styled.img`
  width: 90%;
//   height: 10rem;
  border-radius: 10px;
  margin: 0;
`;

const Nickname = styled.p`
  font-size: 1.4rem;
  margin: 0.2rem;

  font-family: "Song Myung", serif;
  font-weight: bold;
  
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Name = styled.p`
  font-size: 0.9rem;
  margin: 0 0 0.4rem 0;
  color: gray;

  font-family: "Song Myung", serif;
  font-weight: bold;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Introduce = styled.p`
  font-size: 1.1rem;
  margin: 0.2rem;

  font-family: "Song Myung", serif;
  font-weight: bold;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LinkButton = styled.button`
  font-size: 0.8rem;
  font-weight: 700;
  background-color: white;
  color: gray;
  border: 0px;
  margin: 0.5rem 0.1rem 0.5rem 0.1rem;
  cursor: pointer;

  &:hover {
  text-decoration: underline;
  color: gray;
  }
`;