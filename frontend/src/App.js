import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // 连接后端

function App() {
  const [score, setScore] = useState({ itemA: 0, itemB: 0, itemC: 0 });

  useEffect(() => {
    socket.on('scoreUpdate', (newScore) => {
      setScore(newScore);
    });
  }, []);

  const modifyScore = (item, delta) => {
    socket.emit('modifyScore', { item, delta });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>计分系统</h1>
      <p>Item A: {score.itemA}</p>
      <p>Item B: {score.itemB}</p>
      <p>Item C: {score.itemC}</p>
      <button onClick={() => modifyScore('itemA', 1)}>A +1</button>
      <button onClick={() => modifyScore('itemB', 1)}>B +1</button>
      <button onClick={() => modifyScore('itemC', 1)}>C +1</button>
    </div>
  );
}

export default App;
