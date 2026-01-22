// frontend/src/index.js  （前端）

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import RolesPage from './RolesPage';
import App from './App'; // 裁判页面
import InspectionPage from './InspectionPage';
import PlayerPage from './PlayerPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      {/* 首页：机械赛介绍 */}
      <Route path="/" element={<Home />} />

      {/* 参赛人员角色选择页面 */}
      <Route path="/roles" element={<RolesPage />} />

      {/* 裁判页面（计分系统） */}
      <Route path="/score" element={<App />} />

      {/* 机检页面 */}
      <Route path="/inspection" element={<InspectionPage />} />

      {/* 选手页面 */}
      <Route path="/player" element={<PlayerPage />} />

      {/* 比赛详细介绍页面（暂时留空，后续补充手册下载功能） */}
      <Route path="/manual" element={<div>比赛详细介绍页面（待补充）</div>} />
    </Routes>
  </Router>
);
