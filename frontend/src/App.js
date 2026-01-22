// frontend/src/App.js
import React, { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import scheduleJson from './data/schedule.json';
import rankingsJson from './data/rankings.json';
import './Judge.css';

const socket = io('http://localhost:3001');

function App() {
  const [score, setScore] = useState({
    red: { project1: { itemA: 0, itemB: 0 }, project2: { itemC: 0, itemD: 0 }, project3: { itemE: 0 }, foul: 0, projectTotals: { project1: 0, project2: 0, project3: 0 }, total: 0 },
    blue: { project1: { itemA: 0, itemB: 0 }, project2: { itemC: 0, itemD: 0 }, project3: { itemE: 0 }, foul: 0, projectTotals: { project1: 0, project2: 0, project3: 0 }, total: 0 },
    gameStarted: false, gameEnded: false, timeLeft: 300, paused: false, pauseUsed: { red: false, blue: false }, pauseRemaining: 0
  });
  const [error, setError] = useState('');

  const [selectedMatchKey, setSelectedMatchKey] = useState('');
  const [schedule, setSchedule] = useState(() => JSON.parse(localStorage.getItem('scheduleData')) || scheduleJson);
  const [rankings, setRankings] = useState(() => JSON.parse(localStorage.getItem('rankingsData')) || rankingsJson);

  const matchOptions = useMemo(() => schedule.map(m => ({
    key: `Q${m.match}: ${m.red} VS ${m.blue}`,
    label: `Q${m.match}: ${m.red} VS ${m.blue}`
  })), [schedule]);

  const currentMatch = useMemo(() => {
    if (!selectedMatchKey) return null;
    return schedule.find(m => `Q${m.match}: ${m.red} VS ${m.blue}` === selectedMatchKey) || null;
  }, [selectedMatchKey, schedule]);

  useEffect(() => {
    socket.on('scoreUpdate', (newScore) => setScore(newScore));
    socket.on('errorMessage', (msg) => setError(msg));
    return () => { socket.off('scoreUpdate'); socket.off('errorMessage'); };
  }, []);

  useEffect(() => { localStorage.setItem('scheduleData', JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem('rankingsData', JSON.stringify(rankings)); }, [rankings]);

  const modifyScore = (alliance, project, item, delta) => socket.emit('modifyScore', { alliance, project, item, delta });
  const startGame = () => socket.emit('startGame');
  const endGameOnly = () => socket.emit('endGame'); // 仅结束，不登记
  const resetScore = () => socket.emit('resetScore');
  const pause30s = (alliance) => socket.emit('pause30s', alliance);
  const manualPause = () => socket.emit('manualPause');

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const ProjectBlock = ({ alliance, projectName, projectScore }) => (
    <div className="project">
      <h3>{projectName}</h3>
      {Object.entries(projectScore).map(([item, count]) => (
        <div key={item} className="item-row">
          <span className="item-label">{item}: {count}</span>
          <div className="item-actions">
            <button onClick={() => modifyScore(alliance, projectName, item, 1)} disabled={score.paused}>+1</button>
            <button onClick={() => modifyScore(alliance, projectName, item, -1)} disabled={count === 0 || score.paused}>-1</button>
          </div>
        </div>
      ))}
      <p className="project-total">项目总分: {score[alliance].projectTotals[projectName]}</p>
    </div>
  );

  const AlliancePanel = ({ allianceKey, allianceScore, isWinner, title, accent }) => (
    <div className="panel">
      <h2 className={`panel-title ${accent}`}>{title}</h2>
      <div className="projects">
        <ProjectBlock alliance={allianceKey} projectName="project1" projectScore={allianceScore.project1} />
        <ProjectBlock alliance={allianceKey} projectName="project2" projectScore={allianceScore.project2} />
        <ProjectBlock alliance={allianceKey} projectName="project3" projectScore={allianceScore.project3} />
      </div>

      <div className="panel-bottom">
        <span className="foul">违规: {allianceScore.foul}</span>
        <button onClick={() => modifyScore(allianceKey, null, 'foul', 1)} disabled={score.paused}>违规 +1</button>
      </div>

      <div className="panel-total">总分: {allianceScore.total}</div>
      {isWinner && score.gameEnded && <div className="winner">WINNER 🏆</div>}
      {!score.gameEnded && score.gameStarted && (
        <div className="panel-controls">
          <button className="btn-pause" onClick={() => pause30s(allianceKey)} disabled={score.pauseUsed[allianceKey] || score.paused}>
            暂停30秒
          </button>
        </div>
      )}
    </div>
  );

  const redWinner = score.gameEnded && score.red.total > score.blue.total;
  const blueWinner = score.gameEnded && score.blue.total > score.red.total;
  const isDraw = score.gameEnded && score.red.total === score.blue.total;

  const submitResult = () => {
    if (!currentMatch) { alert('请先选择执裁场次！'); return; }
    const redScore = score.red.total;
    const blueScore = score.blue.total;

    const newSchedule = schedule.map(m =>
      m.match === currentMatch.match ? { ...m, result: `${redScore}:${blueScore}` } : m
    );

    const newRankings = rankings.map(r => ({ ...r }));
    const idxRed = newRankings.findIndex(r => r.team === currentMatch.red);
    const idxBlue = newRankings.findIndex(r => r.team === currentMatch.blue);
    if (idxRed !== -1 && idxBlue !== -1) {
      newRankings[idxRed].played += 1;
      newRankings[idxBlue].played += 1;

      newRankings[idxRed].points += redScore;
      newRankings[idxBlue].points += blueScore;

      if (redScore > blueScore) {
        newRankings[idxRed].win += 1;
        newRankings[idxBlue].loss += 1;
      } else if (redScore < blueScore) {
        newRankings[idxBlue].win += 1;
        newRankings[idxRed].loss += 1;
      } else {
        newRankings[idxRed].draw += 1;
        newRankings[idxBlue].draw += 1;
      }
    }

    setSchedule(newSchedule);
    setRankings(newRankings);
    localStorage.setItem('scheduleData', JSON.stringify(newSchedule));
    localStorage.setItem('rankingsData', JSON.stringify(newRankings));

    alert(`结果已提交：Q${currentMatch.match} ${currentMatch.red} ${redScore}:${blueScore} ${currentMatch.blue}`);
  };

  const clearAllResults = () => {
    const clearedSchedule = schedule.map(m => ({ ...m, result: "" }));
    const clearedRankings = rankings.map(r => ({
      ...r,
      played: 0,
      win: 0,
      loss: 0,
      draw: 0,
      points: 0
    }));
    setSchedule(clearedSchedule);
    setRankings(clearedRankings);
    localStorage.removeItem('scheduleData');
    localStorage.removeItem('rankingsData');
    alert("所有比赛结果已清空！");
  };

  const redName = currentMatch ? currentMatch.red : 'Red Team';
  const blueName = currentMatch ? currentMatch.blue : 'Blue Team';

  return (
    <div className="judge-page">
      <h1 className="page-title">多项目对抗赛计分系统</h1>

      <div className="topbar">
        <select
          className="match-select"
          value={selectedMatchKey}
          onChange={(e) => setSelectedMatchKey(e.target.value)}
        >
          <option value="">选择执裁场次</option>
          {matchOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="scoreboard">
        <div className="team-line">
                    <span className="team red">{redName}</span>
          <span>:</span>
          <span className="team blue">{blueName}</span>
        </div>
        <div className="score-line">
          <span className="score red">{score.red.total}</span>
          <span>:</span>
          <span className="score blue">{score.blue.total}</span>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      <div className="timer">倒计时: {formatTime(score.timeLeft)}</div>
      {score.paused && (
        <div className="paused">
          比赛暂停中 {score.pauseRemaining > 0 ? `(${score.pauseRemaining}s)` : ''}
        </div>
      )}

      <div className="panels">
        <AlliancePanel
          allianceKey="red"
          allianceScore={score.red}
          isWinner={redWinner}
          title={redName}
          accent="accent-red"
        />
        <AlliancePanel
          allianceKey="blue"
          allianceScore={score.blue}
          isWinner={blueWinner}
          title={blueName}
          accent="accent-blue"
        />
      </div>

      {isDraw && <div className="draw">DRAW 🤝</div>}

      <div className="controls">
        {!score.gameStarted ? (
          <button className="btn-start" onClick={startGame}>开始比赛</button>
        ) : !score.gameEnded ? (
          <>
            <button className="btn-pause" onClick={manualPause}>手动暂停/恢复</button>
            <button className="btn-end" onClick={endGameOnly}>结束比赛</button>
          </>
        ) : (
          <>
            <button className="btn-submit" onClick={submitResult}>提交比分</button>
            <button className="btn-reset" onClick={resetScore}>清零分数</button>
          </>
        )}

        {/* 一键清空所有结果 */}
        <button className="btn-clear" onClick={clearAllResults}>清空所有结果</button>
      </div>
    </div>
  );
}

export default App;
