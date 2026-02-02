import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [score, setScore] = useState({ itemA: 0, itemB: 0, itemC: 0 });

  useEffect(() => {
    socket.on('scoreUpdate', (newScore) => {
      setScore(newScore);
    });
  }, []);

  const modify = (item, delta) => {
    socket.emit('modifyScore', { item, delta });
  };

  return (
    <div>
      <h1>裁判员计分系统</h1>
      {Object.entries(score).map(([item, value]) => (
        <div key={item}>
          <h2>{item}: {value}</h2>
          <button onClick={() => modify(item, 1)}>+1</button>
          <button onClick={() => modify(item, -1)}>-1</button>
        </div>
      ))}
    </div>
  );
}

export default App;
