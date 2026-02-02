// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import RolesPage from './RolesPage';
import RefereePage from './RefereePage';
import InspectionPage from './InspectionPage';
import PlayerPage from './PlayerPage';
import Login from './Login';   // 登录页面

function App() {
  return (
    <Router>
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<Home />} />

        {/* 登录页 */}
        <Route path="/login" element={<Login />} />

        {/* 参赛人员角色选择页面 */}
        <Route path="/roles" element={<RolesPage />} />

        {/* 裁判页面（计分系统） */}
        <Route path="/score" element={<RefereePage />} />

        {/* 机检页面 */}
        <Route path="/inspection" element={<InspectionPage />} />

        {/* 选手页面 */}
        <Route path="/player" element={<PlayerPage />} />

        {/* 比赛详细介绍页面 */}
        <Route path="/manual" element={<div>比赛详细介绍页面（待补充）</div>} />
      </Routes>
    </Router>
  );
}

export default App;
