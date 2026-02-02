// backend/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

const router = express.Router();

// 使用 session 管理登录状态
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// 假设预设账号密码
const presetUser = {
  username: 'admin',
  passwordHash: bcrypt.hashSync('123456', 10) // 预先加密
};

// 登录接口
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === presetUser.username && bcrypt.compareSync(password, presetUser.passwordHash)) {
    req.session.user = { username };
    res.json({ success: true, message: '登录成功' });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

// 获取当前用户信息
router.get('/api/current-user', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// 登出接口
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: '已退出登录' });
  });
});

module.exports = router;
