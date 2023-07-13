const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// 미들웨어 사용 (미들웨어 : JSON 형태의 요청 BODY를 PARSE 하기 위해 사용)
app.use(express.json());

app.post('/login', (req, res) => {
  const userName = req.body.userName;
  const user = { name : userName };
  const secretText = "hello secret user!";

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

app.get('/posts', (req, res) => {
  res.json(posts);
});

const port = 3001;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})