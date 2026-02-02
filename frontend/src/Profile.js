// frontend/src/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 模拟从后端获取用户信息
    fetch('http://localhost:3001/api/current-user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          // 这里可以扩展为从数据库获取更多信息
          setUserInfo({
            name: data.username,
            studentId: '20260001',
            teamName: '红色战队'
          });
        } else {
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/login');
  };

  if (!userInfo) return <p>加载中...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>个人信息</h2>
      <p>姓名：{userInfo.name}</p>
      <p>学号：{userInfo.studentId}</p>
      <p>队伍名称：{userInfo.teamName}</p>
      <button onClick={handleLogout}>退出登录</button>
    </div>
  );
}

export default Profile;
