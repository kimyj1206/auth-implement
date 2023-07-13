const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// 미들웨어 사용 (미들웨어 : JSON 형태의 요청 BODY를 PARSE 하기 위해 사용)
app.use(express.json());

const secretText = "hello secret user!"; // secret-text

app.post('/login', (req, res) => {
  const userName = req.body.userName;
  const user = { name : userName }; // payload

  // 토큰 생성하기 sign(payload, secret-text)
  const accessToken = jwt.sign(user, secretText);

  // 토큰 클라이언트에게 전송
  res.json({ accessToken : accessToken })
});

// 인증된 사람만 post를 가져갈 수 있음
const posts = [
  {
    userName: 'Lucy',
    title: 'Post 1'
  },
  {
    userName: 'kitty',
    title: 'Post 2'
  }
]

app.get('/posts', authMiddleware, (req, res) => {
  res.json(posts);
});

function authMiddleware(req, res, next) {
  // 토큰을 request headers에서 가져오기 authHeader은 토큰 주소값을 가짐
  const authHeader = req.headers['authorization'];
  // Bearer (토큰)
  // 여기에서의 authHeader는 null 검사용 무조건 해야 함.
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) res.sendStatus(401);
  
  // 토큰이 있으니 유효한 토큰인지 확인
  jwt.verify(token, secretText, (err, user) => {
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const port = 3001;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})