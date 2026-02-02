// frontend/src/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 页面加载时，向后端请求当前用户信息
  useEffect(() => {
    fetch('http://localhost:3001/api/current-user', {
  credentials: 'include'
})

      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUser(data.username);
        }
      });
  }, []);

  return (
    <div>
      {/* 顶部导航栏 */}
      <nav
        style={{
          backgroundColor: '#333',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* 左侧 Logo */}
        <a href="https://gc.sjtu.edu.cn/" target="_blank" rel="noopener noreferrer">
          <img
            src="/Global College.jpg"
            alt="GlobalCollege Logo"
            style={{
              height: '40px',
              position: 'absolute',
              left: '24px',
              top: '0',
              bottom: '0',
              margin: 'auto',
              cursor: 'pointer',
            }}
          />
        </a>

        {/* 中间导航文字 */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <button
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            首页
          </button>
          <button
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer' }}
            onClick={() => navigate('/roles')}
          >
            参赛人员
          </button>
          <button
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer' }}
            onClick={() => navigate('/manual')}
          >
            比赛详细介绍
          </button>
        </div>

        {/* 右侧登录/欢迎语 */}
        <div
          style={{
            position: 'absolute',
            right: '24px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {user ? (
            <span>{user}，欢迎您参加本次机械赛</span>
          ) : (
            <span onClick={() => navigate('/login')}>登录</span>
          )}
        </div>
      </nav>

      {/* 首页内容 */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <h1>机械赛网站首页</h1>
        <p>这里是机械赛的介绍部分（后续补充）。</p>
      </div>
    </div>
  );
}

export default Home;
