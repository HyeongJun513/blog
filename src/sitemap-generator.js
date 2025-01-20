const Sitemap = require('react-router-sitemap').default;
const path = require('path');

// 라우팅 경로 설정
const router = [
  '/', 
  '/post', 
  '/list',
  '/list/:id',
  '/portfolio',
  // 기타 필요한 라우트
];

function generateSitemap() {
  const baseUrl = 'https://hyeongjun513.github.io/blog';

  // URL에 # 추가
  const hashRoutes = router.map((route) => `/#${route}`);

  const sitemap = new Sitemap(hashRoutes)
    .build(baseUrl) // Base URL
    .save(path.resolve('./public/sitemap.xml')); // Output location

  console.log('Sitemap 생성 완료!');
}

generateSitemap();
