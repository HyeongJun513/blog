import { getDatabase, ref, get, set, increment } from "firebase/database";

const VisitorCount = async () => {
  const db = getDatabase();
  const visitorsRef = ref(db, "visitors");

  await get(visitorsRef).then(async (snapshot) => {
    if (snapshot.exists()) {
      // 방문자 수 1 증가
      await set(visitorsRef, snapshot.val() + 1);
    } else {
      // 초기화
      await set(visitorsRef, 1);
    }
  });
};

useEffect(() => {
  VisitorCount();
}, []);
