import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";

const List = () => {
  const [posts, setPosts] = useState([]);

  const location = useLocation();
  const category = location.state?.category || 'all';
  const name = location.state?.name || '전체';

  useEffect(() => {
    const db = getDatabase();
    const postsRef = ref(db, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      const postsArray = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setPosts(postsArray.reverse()); //데이터 역순 (최신 데이터 위로, 과거 데이터 아래로로)
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>{name} 게시글 목록</h1>
      {/* <h2>카테고리 : {category}</h2> */}
      <hr />
      {posts.map((post) => (
        <div key={post.id}>
            {/* <Link to={`/post/${post.id}`}> */}

          {category ==='all' ? //category가 전체인 경우, 전체 게시글 목록 출력
            <Link to={`/list/${post.id}`}>
              <h3>제목 : {post.title}</h3>
              <p>내용 : {post.content}</p>
              <p>분류 : {post.category}</p>
              <p>시간 : {post.uploadTime ? post.uploadTime : '-'}</p>
              <hr />
            </Link>
            :
            post.category === category && //category가 전체가 아닌 경우, post.category와 category가 일치하는 경우만 출력
            <Link to={`/list/${post.id}`}>
            <h3>제목 : {post.title}</h3>
            <p>내용 : {post.content}</p>
            <p>분류 : {post.category}</p>
            <p>시간 : {post.uploadTime ? post.uploadTime : '-'}</p>
            <hr />
          </Link>
          }
        </div>
      ))}
    </div>
  );
};

export default List;
