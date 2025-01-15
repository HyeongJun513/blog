import React from "react";
import styled from "styled-components";

const Profile = () => {
    return (
        <Container>
            <ProfileImg alt="Profile" src={`${process.env.PUBLIC_URL}/img/Profile.png`}/>
            <Nickname>코딩하는 콘스</Nickname>
            <Introduce>안녕하세요. 반갑습니다.</Introduce>

            <LinkButton onClick={() => {window.open("https://github.com/HyeongJun513", "_blank");}}>GitHUB</LinkButton>
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
  width: 100%;
//   height: 10rem;
  border-radius: 10px;
  margin: 1rem 0 0 0;
`;

const Nickname = styled.p`
  font-size: 1.2rem;
  margin: 0.2rem;
`;

const Introduce = styled.p`
  font-size: 1rem;
  margin: 0.2rem;
  color: gray;
`;

const LinkButton = styled.button`
  font-size: 0.8rem;
  font-weight: 700;
  background-color: white;
  color: gray;
  border: 0px;
  margin: 0.3rem 0.3rem 0 0;
  cursor: pointer;

  &:hover {
  text-decoration: underline;
  color: gray;
  }
`;