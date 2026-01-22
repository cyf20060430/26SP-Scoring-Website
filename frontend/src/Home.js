// frontend/src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* 顶部导航栏 */}
      <nav
        style={{
          backgroundColor: '#333',
          height: '50px',              // 导航栏高度固定 40px
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* 左侧 Logo 图片，点击跳转外部网站 */}
        <a href="https://gc.sjtu.edu.cn/" target="_blank" rel="noopener noreferrer">
          <img
            src="/GlobalCollege.png"   // public 文件夹里的图片
            alt="GlobalCollege Logo"
            style={{
              height: '40px',          // 图片高度固定 40px
              position: 'absolute',
              left: '24px',
              top: '0',
              bottom: '0',
              margin: 'auto',
              cursor: 'pointer',
            }}
          />
        </a>

        {/* 中间导航文字，真正居中对齐 */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)', // 保证相对于屏幕居中
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
      </nav>

      {/* 首页内容 */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <h1>机械赛网站首页</h1>
        {/* TODO: 在这里填写机械赛的介绍内容 */}
        <p>这里是机械赛的介绍部分（后续补充）。</p>
      </div>
    </div>
  );
}

export default Home;
