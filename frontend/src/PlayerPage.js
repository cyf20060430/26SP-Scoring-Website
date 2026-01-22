// frontend/src/PlayerPage.js
import React from 'react';
import './Player.css';

function PlayerPage() {
  const boundTeam = localStorage.getItem('boundTeam');

  // 从 localStorage 读取最新赛程和排名
  const scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];
  const rankingsData = JSON.parse(localStorage.getItem('rankingsData')) || [];

  const sortedRankings = [...rankingsData].sort((a, b) => b.points - a.points);

  return (
    <div className="player-page">
      <h1 style={{ textAlign: 'center' }}>选手页面</h1>

      {boundTeam && (
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          当前绑定队伍：<span style={{ color: '#0000CD' }}>{boundTeam}</span>
        </h3>
      )}

      {/* 赛程表 */}
      <h2 style={{ textAlign: 'center' }}>赛程</h2>
      <table>
        <thead>
          <tr>
            <th>场次</th>
            <th>红方</th>
            <th>蓝方</th>
            <th>时间</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((s) => (
            <tr key={s.match}>
              <td>{s.match}</td>
              <td className="red-team" style={{ backgroundColor: boundTeam === s.red ? '#ADD8E6' : 'transparent' }}>
                {s.red}
              </td>
              <td className="blue-team" style={{ backgroundColor: boundTeam === s.blue ? '#ADD8E6' : 'transparent' }}>
                {s.blue}
              </td>
              <td>{s.time}</td>
              <td>{s.result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 排名表 */}
      <h2 style={{ textAlign: 'center', marginTop: '40px' }}>排名表</h2>
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>队伍名称</th>
            <th>总场次</th>
            <th>胜</th>
            <th>负</th>
            <th>平</th>
            <th>总得分</th>
          </tr>
        </thead>
        <tbody>
          {sortedRankings.map((r, index) => {
            let rowStyle = {};
            if (index < 4) rowStyle.backgroundColor = '#90EE90'; // 胜者组晋级
            else if (index < 8) rowStyle.backgroundColor = '#FFD700'; // 败者组晋级
            if (boundTeam && r.team === boundTeam) rowStyle.backgroundColor = '#ADD8E6'; // 自己队伍
            return (
              <tr key={r.team} style={rowStyle}>
                <td>{index + 1}</td>
                <td>{r.team}</td>
                <td>{r.played}</td>
                <td>{r.win}</td>
                <td>{r.loss}</td>
                <td>{r.draw}</td>
                <td>{r.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 图例说明紧贴排名表 */}
      <div className="legend" style={{ textAlign: 'center' }}>
        <p>
          图例：<span className="legend-green">绿色高亮</span> = 胜者组晋级 (1-4名)，
          <span className="legend-yellow">黄色高亮</span> = 败者组晋级 (5-8名)，
          <span className="legend-blue">蓝色高亮</span> = 自己队伍，
          未高亮 = 淘汰
        </p>
      </div>
    </div>
  );
}

export default PlayerPage;
