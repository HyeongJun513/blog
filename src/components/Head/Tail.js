import React from "react";
import styled from "styled-components";

const Tail = () => {
    return(
        <Container>
            <div style={{width:'80%'}}>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <Text1>팔로우 : </Text1>
                    <LinkButton onClick={() => {window.open("https://github.com/HyeongJun513", "_blank");}}>GitHUB</LinkButton>
                </div>
                <Text2>© 2025. Park Hyeong Jun. All rights reserved.</Text2>
                <Text3>
                    Icons made by{" "}
                    <a
                        href="https://www.flaticon.com/kr/free-icon/education_2092446"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        [srip]
                    </a>{" "}
                    from{" "}
                    <a
                        href="https://www.flaticon.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Flaticon
                    </a>
                </Text3>
            </div>
        </Container>
    );
};
//<a href="https://www.flaticon.com/kr/free-icons/" title="교육 아이콘">교육 아이콘 제작자: srip - Flaticon</a>
export default Tail;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  width: 100%;
  height: 8rem;
  margin: 5rem 0 0 0;
  text-align: left;
//   border-top: 1px solid black;
`;

const Text1 = styled.p`
  color: gray;
  font-size: 0.8rem;
  font-weight: bold;
  margin: 0;
`;

const Text2 = styled.p`
  color: gray;
  font-size: 0.8rem;
  margin: 0.5rem 0 0 0;
`;

const Text3 = styled.p`
  color: gray;
  font-size: 0.8rem;
  margin: 0.3rem 0 0 0;
`;

const LinkButton = styled.button`
  font-size: 0.8rem;
  font-weight: 700;
  color: gray;
  background-color: lightgray;
  border: 0px;
  margin: 0.3rem 0.3rem 0 0;
  cursor: pointer;

  &:hover {
  text-decoration: underline;
  color: gray;
  }
`;